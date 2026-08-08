const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'abtalks_secret_key_2026_jwt_token_secure';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, missing token' });
  }
};

module.exports = authMiddleware;
