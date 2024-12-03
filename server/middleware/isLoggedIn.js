import { StatusCodes } from "http-status-codes";
import { ExpressError } from "../ExpressError/ExpressError.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    throw new ExpressError("User is not logged in", StatusCodes.UNAUTHORIZED);
  }
  next();
};
