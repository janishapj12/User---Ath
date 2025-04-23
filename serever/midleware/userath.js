import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default userAuth;
