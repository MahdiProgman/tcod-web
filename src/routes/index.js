import { Router } from "express";
import authRouter from "./auth/index.js";
import courseRouter from "./course/index.js";
import userRouter from "./user/index.js";
import adminRouter from "./admin/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

export default router;
