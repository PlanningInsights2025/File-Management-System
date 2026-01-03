// Role-based access control middleware

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden - You do not have permission to access this resource',
        requiredRole: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

// Export for different import styles
module.exports = { checkRole };
module.exports.checkRole = checkRole;