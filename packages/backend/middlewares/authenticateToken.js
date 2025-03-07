import jwt from "jsonwebtoken";
/**import Handler */
export const authenticateToken = async (req, res, next) => {

  // const token = req.headers.authorization;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access denied, no token" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    
    
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }

};
