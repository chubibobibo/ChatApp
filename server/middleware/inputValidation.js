import { StatusCodes } from "http-status-codes";
import { ExpressError } from "../ExpressError/ExpressError.js";
import { UserModel } from "../models/UserSchema.js";
import { body, param, validationResult } from "express-validator";
//create a function that will handle the error
//This function will accept an array (validateValues) of valeus to be validated.
//then this function will return the array we passed as an argument and an error response
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req); //this returns all available errors based on the validation provided when checking the incoming request.
      //check if the errors array is not empty meaning there errors.
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((allErrors) => allErrors.msg); //turns the errors from the validationResult into array then mapped it to access the msg key for every item in the original array, then populate the created array with that.
        throw new ExpressError(errorMessages); //use the custom error that we created and pass the errorMessages that we mapped instead of a string.
      }
      next();
    },
  ];
};

export const registerInputValidation = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "Username should be at least 4 characters and not exceed 15 characters"
    )
    .custom(async (username) => {
      const foundUsername = await UserModel.findOne({ username: username });
      if (foundUsername) {
        throw new ExpressError(
          "Username already in use",
          StatusCodes.BAD_REQUEST
        );
      }
    }),
  body("firstName")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "firstName should be at least 4 characters and not exceed 15 characters"
    ),
  body("lastName")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "lastName should be at least 4 characters and not exceed 15 characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email should be valid")
    .custom(async (email) => {
      const foundEmail = await UserModel.findOne({ email: email });
      if (foundEmail) {
        throw new ExpressError("Email already used", StatusCodes.BAD_REQUEST);
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),
]);

export const loginInputValidation = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "Username should be at least 4 characters and not exceed 15 characters"
    ),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),
]);

/** Update user input validation */
export const updateUserValidation = withValidationErrors([
  param("id").custom(async (id, { req }) => {
    if (id !== req.user._id) {
      throw new ExpressError(
        "You are not allowed to modify this profile",
        StatusCodes.UNAUTHORIZED
      );
    }
  }),
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "Username should be at least 4 characters and not exceed 15 characters"
    )
    .custom(async (username, { req }) => {
      const foundUsername = await UserModel.findOne({ username: username });
      if (foundUsername && foundUsername.username !== req.user.username) {
        throw new ExpressError(
          "Username already in use",
          StatusCodes.BAD_REQUEST
        );
      }
    }),
  body("firstName")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "firstName should be at least 4 characters and not exceed 15 characters"
    ),
  body("lastName")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 4, max: 15 })
    .withMessage(
      "lastName should be at least 4 characters and not exceed 15 characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email should be valid")
    .custom(async (email, { req }) => {
      const foundEmail = await UserModel.findOne({ email: email });
      if (foundEmail && foundEmail.email !== req.user.email) {
        throw new ExpressError("Email already used", StatusCodes.BAD_REQUEST);
      }
    }),
]);
