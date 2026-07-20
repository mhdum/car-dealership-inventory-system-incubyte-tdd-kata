const jwt = require("jsonwebtoken");

const generateToken = (payload:any) => {
  // if (!process.env.JWT_SECRET) {
  //   throw new Error("JWT secret is missing");
  // }

  const token = jwt.sign(payload, process.env.JWT_SECRET||"abcdef", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY||"1d",
  });

  return token;
};

const verifyToken = (token:string) => {
  // if (!process.env.JWT_SECRET) {
  //   throw new Error("JWT secret is missing");
  // }

  return jwt.verify(token, process.env.JWT_SECRET||"abcdef");
};

module.exports = {
  generateToken,
  verifyToken,
};