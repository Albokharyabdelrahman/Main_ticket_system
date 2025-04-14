// middleware/authenticate.js
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

module.exports = function AuthenticationMiddleware(req, res, next) {
  console.log("Inside authentication middleware");

  let token;

  // Try to get token from cookies (if cookie-parser is used)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Or try from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Or extract from raw cookie header (if not using cookie-parser)
  else if (req.headers.cookie) {  
    const rawCookies = req.headers.cookie.split("; "); //Used only if Cookie-Parser is not installed
    const tokenCookie = rawCookies.find(c => c.startsWith("token="));
    if (tokenCookie) token = tokenCookie.split("=")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
