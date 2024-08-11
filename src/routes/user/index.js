import { Router } from "express";
import controller from "./controller.js";
import validator from "./validator.js";
import authMiddleware from "./../../middlewares/auth.js";
import emailVerifiedMiddleware from './../../middlewares/emailVerified.js';

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getUserInformation);
router.get('/email-verification', controller.emailVerification);
router.post(
  '/email-verify',
  validator.codeValidation(),
  controller.validate,
  controller.verifyEmail
);
router.get('/tickets', controller.getTickets);
router.post(
  "/ticket",
  validator.ticketValidation(),
  controller.validate,
  controller.sendTicket
);
router.put(
  "/",
  validator.userValidation(),
  controller.validate,
  controller.editUserInformation
);
router.put(
  "/password",
  validator.passwordValidation(),
  controller.validate,
  controller.changePassword
);
router.post("/profile", controller.uploadImageToProfile);

router.use(emailVerifiedMiddleware);

router.post(
  "/cart",
  validator.courseIdValidation(),
  controller.validate,
  controller.addCourseToCart
);
router.delete(
  "/cart",
  validator.courseIdValidation(),
  controller.validate,
  controller.deleteCourseFromCart
);
router.post("/cart/buy", controller.buyAnyCourseInCart);
router.post(
  '/course/comment',
  validator.commentValidation(),
  controller.validate,
  controller.addCommentToCourse
);

export default router;
