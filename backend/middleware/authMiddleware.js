import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes: Verifies the JWT token
 */
export const protect = (req, res, next) => {
  let token;

  // 1. Check for Authorization header and ensure it uses the Bearer schema
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Return 401 if no token is found
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, no token provided" 
    });
  }

  try {
    // 3. Verify the token using your Railway environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user data (e.g., id, role) to the request object
    req.user = decoded;
    
    next();
  } catch (err) {
    // Specific error messages for expired vs invalid tokens
    const message = err.name === 'TokenExpiredError' ? "Token expired" : "Token is not valid";
    return res.status(401).json({ success: false, message });
  }
};

/**
 * Middleware to restrict access based on user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user exists and has a permitted role
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role '${req.user?.role || 'unknown'}' is not authorized to access this resource` 
      });
    }
    next();
  };
};
