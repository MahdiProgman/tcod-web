import { check } from "express-validator";

export default new (class {
  courseValidation() {
    return [
      // name Validation
      check("name").trim().notEmpty().withMessage("فیلد نام خالی است"),
      check("name")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد نام نباید شامل فاصله باشد"),
      // title validation
      check("title").trim().notEmpty().withMessage("فیلد عنوان خالی است"),
      // description validation
      check("description")
        .trim()
        .notEmpty()
        .withMessage("فیلد توضیحات خالی است"),
      // category validation
      check("category")
        .trim()
        .notEmpty()
        .withMessage("فیلد دسته بندی خالی است"),
      // viewType validation
      check("viewType")
        .trim()
        .notEmpty()
        .withMessage("فیلد نوع مشاهده خالی است"),
      check("viewType")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد نوع پشتیبانی نباید شامل فاصله باشد"),
      check("viewType")
        .isNumeric()
        .withMessage("فیلد نوع مشاهده باید داده عددی باشد"),
      // support validation
      check("supportType")
        .isNumeric()
        .withMessage("فیلد نوع پشتیبانی باید داده عددی باشد"),
      check("supportType")
        .trim()
        .notEmpty()
        .withMessage("فیلد نوع پشتیبانی خالی است"),
      check("supportType")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد نوع مشاهده نباید شامل فاصله باشد"),
      // courseStatus validation
      check("courseStatus")
        .trim()
        .notEmpty()
        .withMessage("فیلد وضعیت دوره خالی است"),
      check("courseStatus")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد وضعیت دوره نباید شامل فاصله باشد"),
      check("courseStatus")
        .isNumeric()
        .withMessage("فیلد وضعیت دوره باید داده عددی باشد"),
    ];
  }
  seasonValidation() {
    return [
      check("title").notEmpty().withMessage("فیلد تایتل نباید خالی باشد"),
      check("courseId")
        .notEmpty()
        .withMessage("فیلد courseId نباید خالی باشد "),
    ];
  }
  episodeValidation() {
    return [
      check("title")
        .trim()
        .notEmpty()
        .withMessage("فیلد title نباید خالی باشد"),
      check("seasonId").notEmpty().withMessage("فیلد seasonId نباید خالی باشد"),
    ];
  }
  categoryValidation() {
    return [
      check("name").trim().notEmpty().withMessage("فیلد نام نباید خالی باشد"),
      check("title")
        .trim()
        .notEmpty()
        .withMessage("فیلد عنوان نباید خالی باشد"),
    ];
  }
  disscountValidation() {
    return [
      check("type").trim().notEmpty().withMessage("فیلد نوع نباید خالی باشد"),
      check("type")
        .isIn(["percent", "toman"])
        .withMessage("فیلد نوع باید percent یا toman باشد"),
      check("enableFor")
        .trim()
        .notEmpty()
        .withMessage("فیلد enableFor نباید خالی باشد"),
      check("enableFor")
        .isIn(["all", "some", "one"])
        .withMessage("فیلد enableFor باید all یا some یا one"),
      check("startDisscountDate")
        .trim()
        .notEmpty()
        .withMessage("فیلد startDisscountDate نباید خالی باشد"),
      check("startDisscountDate")
        .custom((value) =>
          /(1[3-5]\d{2})\/(0[7-9]\/(0[1-9]|[12][1-9]|30)|1[012]\/(0[1-9]|[12][1-9]|30)|0[1-6]\/(0[1-9]|[12][1-9]|3[01]))/.test(
            value
          )
        )
        .withMessage("فیلد startDisscountDate باید یک تاریخ معتبر شمسی باشد"),
      check("endDisscountDate")
        .trim()
        .notEmpty()
        .withMessage("فیلد endDisscountDate نباید خالی باشد"),
      check("endDisscountDate")
        .custom((value) =>
          /(1[3-5]\d{2})\/(0[7-9]\/(0[1-9]|[12][1-9]|30)|1[012]\/(0[1-9]|[12][1-9]|30)|0[1-6]\/(0[1-9]|[12][1-9]|3[01]))/.test(
            value
          )
        )
        .withMessage("فیلد endDisscountDate باید یک تاریخ معتبر شمسی باشد"),
    ];
  }
})();
