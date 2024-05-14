import jwt from "jsonwebtoken";

export const createJWT = (
  payload,
  options = {
    expiresIn: "1h",
  }
) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};
