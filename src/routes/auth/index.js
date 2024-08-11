import { Router } from "express";
import controller from "./controller.js";
import validator from "./validator.js";

const router = Router();

router.post(
  "/login",
  validator.loginValidation(),
  controller.validate,
  controller.login
);

router.post(
  "/register",
  validator.registerValidation(),
  controller.validate,
  controller.register
);

export default router;
