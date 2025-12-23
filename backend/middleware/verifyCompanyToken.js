import jwt from "jsonwebtoken";

export const verifyCompanyToken = (req, res, next) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.COMPANY_JWT_SECRET);
    req.applicationId = decoded.applicationId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
