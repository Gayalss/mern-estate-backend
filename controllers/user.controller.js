import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "Unauthorized", "You can update only your account")
    );
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      user: rest,
    });
  } catch (error) {}
};
