import "express-async-errors";
import { ExpressError } from "../ExpressError/ExpressError.js";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/UserSchema.js";

/** Registering user */
export const userRegister = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  if (!req.body) {
    throw new ExpressError("No data received", StatusCodes.BAD_REQUEST);
  }
  const isAdmin = (await UserModel.countDocuments()) === 0;
  const role = isAdmin ? "admin" : "user";
  const registeredUser = await UserModel.create({
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
  });
  await registeredUser.setPassword(password);
  await registeredUser.save();

  if (!registeredUser) {
    throw new ExpressError(
      "There is a problem registering the user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "User successfully registered", registeredUser });
};

/** Logging in users */
export const userLogin = async (req, res) => {
  if (!req.body) {
    throw new ExpressError("No data received", StatusCodes.BAD_REQUEST);
  }

  const foundUser = await UserModel.findOne({ username: req.body.username });
  if (!foundUser) {
    throw new ExpressError("User does not exist", StatusCodes.BAD_REQUEST);
  }
  res.status(StatusCodes.OK).json({ message: "User successfully logged in" });
};
