import { Router } from "express";
import controller from "./controller.js";
import validator from "./validator.js";
import checkUserIsTeacher from "./../../middlewares/checkUserIsTeacher.js";
import checkUserIsAdmin from "./../../middlewares/checkUserIsAdmin.js";

const router = Router();

router.get("/", controller.getCourses);
router.get("/:name", controller.getOneCourse);

router.use(checkUserIsTeacher);

router.post(
  "/create",
  validator.courseValidation(),
  controller.validate,
  controller.postCourse
);
router.put(
  "/edit",
  validator.courseValidation(),
  controller.validate,
  controller.editCourse
);
router.put("/thumbnail", controller.changeTumbnailOfCourse);
router.post(
  "/seasons/create",
  validator.seasonValidation(),
  controller.validate,
  controller.addSeasonToCourse
);
router.post(
  "/seasons/edit",
  validator.seasonValidation(),
  controller.validate,
  controller.editSeason
);
router.post(
  "/episodes/create",
  validator.episodeValidation(),
  controller.validate,
  controller.addEpisodeToSeason
);
router.post(
  "/disscount/create",
  validator.disscountValidation(),
  controller.validate,
  controller.createDisscount
);

router.use(checkUserIsAdmin);

router.post("/category/create", controller.addCategory);

export default router;
