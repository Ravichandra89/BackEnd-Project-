import { Router } from "express";
import {
  registerUser,
  userLogout,
  loginUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

// Secure & Autorized Routes

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

export default router;
