import { Router } from "express";
import controller from "./controller.js";
import validator from "./validator.js";
import checkUserIsAdmin from "./../../middlewares/checkUserIsAdmin.js";

const router = Router();

router.get("/tickets", controller.getTickets);
router.post(
  "/ticket/reply",
  validator.ticketValidation(),
  controller.validate,
  controller.replyToUserTicket
);
router.post(
  "/permission",
  validator.addPermissionToUserValidation(),
  controller.validate,
  controller.addPermissionToUser
);

export default router;
