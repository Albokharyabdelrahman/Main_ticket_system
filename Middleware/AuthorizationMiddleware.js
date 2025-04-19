module.exports = function authorizationMiddleware(roles) {
    return (req, res, next) => {
      if (!req.user) {
        console.log("AuthorizationMiddleware: No user on request.");
        return res.status(401).json({ error: "Unauthorized", message: "User not authenticated" });
      }
  
      const userRole = req.user.role;
      console.log(`AuthorizationMiddleware: User role = ${userRole}, Required roles = ${roles}`);
  
      if (!roles.includes(userRole)) {
        console.warn(`AuthorizationMiddleware: Access denied. User role "${userRole}" not in [${roles}]`);
        return res.status(403).json({
          error: "Forbidden",
          message: `Requires roles: [${roles}]`,
          yourRole: userRole
        });
      }
  
      console.log("AuthorizationMiddleware: Access granted.");
      next();
    };
  };
  