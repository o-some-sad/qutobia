import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const handleLogin = async (email, password) => {
  if (!email || !password) {
    const err = new Error("email and passwords are required");
    err.status = 400;
    throw err;
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const err = new Error("user not found");
    err.status = 404;
    throw err;
  }
  const isValidPass = await user.comparePassowrd(password);
  if (!isValidPass) {
    const err = new Error("email or password are invalid");
    err.status = 400;
    throw err;
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  };
};
export const handleLogout = async () => {}; //not needed, logic should be handled in the client side.
export const handleMe = async () => {}; //not needed, logic handled entirely in the router.
