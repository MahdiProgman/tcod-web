import { check } from "express-validator";

export default new (class {
  addPermissionToUserValidation() {
    return [
      check("role").trim().isIn(["admin", "teacher"]),
      check("userEmail")
        .trim()
        .notEmpty()
        .withMessage("فیلد یوزرایمیل نباید خالی باشد"),
      check("userEmail")
        .isEmail()
        .withMessage("فیلد یوزرایمیل باید شامل یک ایمیل معتبر باشد"),
    ];
  }
  ticketValidation() {
    return [
      check("title").trim().notEmpty().withMessage("فیلد عنوان تیکت خالی است"),
      check("text").trim().notEmpty().withMessage("فیلد متن تیکت خالی است"),
    ];
  }
})();
