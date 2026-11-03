const jwt = require('jsonwebtoken');
const { UserStore } = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'zenxnic_clinic_jwt_secret_key_2026_supersecure';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserStore.findById(decoded.id);
    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists or is disabled.'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role) && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource. Required: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
