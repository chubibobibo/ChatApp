import express from "express";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import {
  userRegister,
  userLogin,
  userUpdate,
  userLogout,
} from "../controllers/authController.js";

import {
  registerInputValidation,
  loginInputValidation,
  updateUserValidation,
} from "../middleware/inputValidation.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const router = express.Router();

router.post("/register", registerInputValidation, userRegister);
router.post("/login", loginInputValidation, (req, res, next) => {
  /** @authenticate passport method that authenticates using the local strategy  */
  /** @user if auth is successful this will be the user obj */
  /** @info will contain err messages */
  // if there is an err during authentication, it is passed to the next middleware or route
  passport.authenticate("local", (err, user, info) => {
    // auth error
    if (err) {
      return next(err);
    }
    // handling auth failure (no user)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: info.message || "Invalid username or password",
      });
    }
    // authenticated user
    /** @user once auth is successful. user is serialized and stores user's id in session (user stays logged in) */
    /**req.login generates a session for the user to be serialized in */
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return userLogin(req, res); //handles further actions like sending success response
    });
  })(req, res, next);
});

/** Logout user */
router.post("/logout", userLogout);
/** Update user profile */
router.patch("/updateUser/:id", isLoggedIn, updateUserValidation, userUpdate);

export default router;
