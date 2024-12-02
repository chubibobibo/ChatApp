import express from "express";
import { userRegister } from "../controllers/authController.js";

import { registerInputValidation } from "../middleware/inputValidation.js";
const router = express.Router();

router.post("/register", registerInputValidation, userRegister);

export default router;
