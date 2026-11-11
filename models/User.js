const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    passwordResetOtpHash: { type: String, default: undefined },
    passwordResetOtpExpiresAt: { type: Date, default: undefined },
    passwordResetOtpAttempts: { type: Number, default: 0 },
    passwordResetOtpRequestedAt: { type: Date, default: undefined },
    role: {
      type: String,

      default: 'Staff'
    },
    phone: { type: String, default: '' },
    designation: { type: String, default: '' },
    regNumber: { type: String, default: '' },
    qualifications: { type: String, default: '' },
    signatureUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);