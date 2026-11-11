const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { UserStore } = require('../config/store');
const { JWT_SECRET } = require('../middleware/auth');
const { sendPasswordResetOtp } = require('../services/emailService');

const RESET_OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESET_OTP_COOLDOWN_MS = 60 * 1000;
const RESET_OTP_MAX_ATTEMPTS = 5;

const hashResetOtp = (otp) => crypto.createHmac('sha256', JWT_SECRET).update(otp).digest('hex');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role || 'Staff', name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  obj.id = obj._id;
  return obj;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await UserStore.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await UserStore.findOne({ email, isActive: { $ne: false } });
    if (user) {
      const requestedAt = user.passwordResetOtpRequestedAt
        ? new Date(user.passwordResetOtpRequestedAt).getTime()
        : 0;
      if (Date.now() - requestedAt < RESET_OTP_COOLDOWN_MS) {
        return res.json({
          success: true,
          message: 'If an active account exists for this email, a verification code has been sent.'
        });
      }

      const otp = crypto.randomInt(100000, 1000000).toString();
      const otpHash = hashResetOtp(otp);
      await UserStore.findByIdAndUpdate(user._id, {
        passwordResetOtpHash: otpHash,
        passwordResetOtpExpiresAt: new Date(Date.now() + RESET_OTP_EXPIRY_MS),
        passwordResetOtpAttempts: 0,
        passwordResetOtpRequestedAt: new Date()
      });

      try {
        await sendPasswordResetOtp(email, otp);
      } catch (error) {
        await UserStore.findByIdAndUpdate(user._id, {
          $unset: {
            passwordResetOtpHash: 1,
            passwordResetOtpExpiresAt: 1,
            passwordResetOtpAttempts: 1,
            passwordResetOtpRequestedAt: 1
          }
        });
        throw error;
      }
    }

    res.json({
      success: true,
      message: 'If an active account exists for this email, a verification code has been sent.'
    });
  } catch (err) {
    console.error('Password reset email failed:', err);
    res.status(503).json({ success: false, message: 'Unable to send a verification code right now. Please try again later.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
    const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !/^\d{6}$/.test(otp) || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Provide a valid email, 6-digit code and a password of at least 8 characters.'
      });
    }

    const user = await UserStore.findOne({ email, isActive: { $ne: false } });
    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return res.status(400).json({ success: false, message: 'The verification code is invalid or expired.' });
    }

    if (new Date(user.passwordResetOtpExpiresAt).getTime() <= Date.now()) {
      await UserStore.findByIdAndUpdate(user._id, {
        $unset: {
          passwordResetOtpHash: 1,
          passwordResetOtpExpiresAt: 1,
          passwordResetOtpAttempts: 1,
          passwordResetOtpRequestedAt: 1
        }
      });
      return res.status(400).json({ success: false, message: 'The verification code is invalid or expired.' });
    }

    const submittedHash = hashResetOtp(otp);
    const storedHash = Buffer.from(user.passwordResetOtpHash, 'hex');
    const isValidOtp = storedHash.length === Buffer.from(submittedHash, 'hex').length
      && crypto.timingSafeEqual(storedHash, Buffer.from(submittedHash, 'hex'));

    if (!isValidOtp) {
      const attempts = (user.passwordResetOtpAttempts || 0) + 1;
      const update = attempts >= RESET_OTP_MAX_ATTEMPTS
        ? {
            $unset: {
              passwordResetOtpHash: 1,
              passwordResetOtpExpiresAt: 1,
              passwordResetOtpAttempts: 1,
              passwordResetOtpRequestedAt: 1
            }
          }
        : { passwordResetOtpAttempts: attempts };
      await UserStore.findByIdAndUpdate(user._id, update);
      return res.status(400).json({
        success: false,
        message: attempts >= RESET_OTP_MAX_ATTEMPTS
          ? 'Too many incorrect codes. Request a new verification code.'
          : 'The verification code is invalid or expired.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserStore.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: {
        passwordResetOtpHash: 1,
        passwordResetOtpExpiresAt: 1,
        passwordResetOtpAttempts: 1,
        passwordResetOtpRequestedAt: 1
      }
    });

    res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, designation, qualifications, regNumber } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existing = await UserStore.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserStore.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'Staff',
      phone: phone || '',
      designation: designation || 'Staff',
      qualifications: qualifications || '',
      regNumber: regNumber || '',
      isActive: true
    });

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSetupStatus = async (req, res) => {
  try {
    const count = await UserStore.countDocuments();
    res.json({ success: true, isInitialized: count > 0, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await UserStore.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserStore.find({}, { createdAt: -1 });
    const safeUsers = users.map(u => sanitizeUser(u));
    res.json({ success: true, count: safeUsers.length, users: safeUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, designation, qualifications, regNumber } = req.body;
    const existing = await UserStore.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const newUser = await UserStore.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'Staff',
      phone: phone || '',
      designation: designation || 'Staff',
      qualifications: qualifications || '',
      regNumber: regNumber || '',
      isActive: true
    });
    res.status(201).json({ success: true, user: sanitizeUser(newUser) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await UserStore.findByIdAndUpdate(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: sanitizeUser(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
