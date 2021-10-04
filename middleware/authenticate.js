var jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Get token from the header
  const token = req.header('Authorization');
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied!' });
  }
  // verify token
  try {
    const decoded = jwt.verify(token, 'i-am-the-secret-key-of-coding-exercise');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid!' });
  }
}

module.exports = authenticate;