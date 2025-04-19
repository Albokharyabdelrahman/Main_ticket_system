const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = function authenticate(req, res, next) {
  let token;

  // Priority: Cookie (with cookie-parser)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback: Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token found
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // Attach standardized payload structure
    req.user = {
      userId: decoded.userId || decoded.id, // support both field names
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
