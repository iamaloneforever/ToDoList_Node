import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JSON_SECRET!, {
    expiresIn: "1h",
  });
};
