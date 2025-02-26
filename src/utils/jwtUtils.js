import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const comparePassword = async (receivedPassword, actualPassword) => {
  const res = await bcrypt.compare(receivedPassword, actualPassword);
  return res;
};

export const generateAcessToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email, fullname: user.fullname },
    process.env.ACCESS_TOKEN_SECRET, // Ensure this is set in your .env
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return token;
};

export const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email, fullname: user.fullname },
    process.env.REFRESH_TOKEN_SECRET, // Ensure this is set in your .env
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return token;
};
