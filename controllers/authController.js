const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserStore } = require('../config/store');
const { JWT_SECRET } = require('../middleware/auth');

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
