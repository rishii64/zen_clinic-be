const jwt = require('jsonwebtoken');
const { UserStore } = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET;

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

// Role-based access removed: authorize is now a passthrough allowing all authenticated requests
const authorize = () => (req, res, next) => next();

module.exports = { protect, authorize, JWT_SECRET };
