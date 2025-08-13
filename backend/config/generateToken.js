import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  } catch (error) {
    console.log("Generate token error ", error.message);
  }
};
