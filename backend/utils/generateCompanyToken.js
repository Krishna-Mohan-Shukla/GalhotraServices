import jwt from "jsonwebtoken";

export const generateCompanyToken = (applicationId, companyEmail) => {
  return jwt.sign(
    { applicationId, companyEmail },
    process.env.COMPANY_JWT_SECRET,
    { expiresIn: "7d" }
  );
};
