import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";
import Listing from "../models/Listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (req, res, next) => {
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
    res.status(200).json(rest);
  } catch (error) {}
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "Unauthorized", "You can delete only your account")
    );
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      const listings = await Listing.find({ userRef: req.params.id });
      return res.status(200).json(listings);
    } else {
      return next(
        errorHandler(401, "Unauthorized", "You can only see your listings")
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
