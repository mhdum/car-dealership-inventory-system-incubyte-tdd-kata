const jwt = require("jsonwebtoken");

const generateToken = (payload:any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is missing");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  return token;
};

const verifyToken = (token:string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is missing");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};