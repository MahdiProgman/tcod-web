import { check } from "express-validator";

export default new (class {
  ticketValidation() {
    return [
      check("title").trim().notEmpty().withMessage("فیلد عنوان تیکت خالی است"),
      check("text").trim().notEmpty().withMessage("فیلد متن تیکت خالی است"),
    ];
  }

  userValidation() {
    return [
      check("first_name")
        .trim()
        .notEmpty()
        .withMessage("فیلد نام نباید خالی باشد"),
      check("last_name")
        .trim()
        .notEmpty()
        .withMessage("فیلد نام خانوادگی نباید خالی باشد"),
      check("email")
        .trim()
        .notEmpty()
        .withMessage("فیلد ایمیل نباید خالی باشد"),
      check("email").isEmail().withMessage("فیلد ایمیل شامل ایمیل معتبر نیست"),
      check("email")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد ایمیل نباید شامل فاصله باشد"),
      check("user_name")
        .trim()
        .notEmpty()
        .withMessage("فیلد نام کاربری خالی است"),
      check("user_name")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد نام کاربری نباید شامل فاصله باشد"),
    ];
  }

  passwordValidation() {
    return [
      check("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("فیلد رمز عبور قدیمی نباید خالی باشد"),
      check("oldPassword")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد رمز عبور قدیمی شامل فاصله خالی باشد"),
      check("newPassword")
        .trim()
        .notEmpty()
        .withMessage("فیلد رمز عبور جدید نباید خالی باشد"),
      check("newPassword")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد رمز عبور جدید شامل فاصله خالی باشد"),
    ];
  }

  commentValidation() {
    return [
      check("courseId")
        .trim()
        .notEmpty()
        .withMessage("فیلد کورس آیدی نباید خالی باشد"),
      check("text").trim().notEmpty().withMessage("فیلد تکست نباید خالی باشد"),
    ];
  }

  courseIdValidation() {
    return [
      check("courseId")
        .notEmpty()
        .withMessage("فیلد کورس آیدی نباید خالی باشد"),
    ];
  }

  codeValidation() {
    return [
      check("code").notEmpty().withMessage("فیلد کد نباید خالی باشد"),
      check("code").isNumeric().withMessage("فیلد کد باید شامل عدد باشد"),
    ];
  }
})();
