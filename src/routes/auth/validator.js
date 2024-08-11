import { check } from "express-validator";

export default new (class {
  registerValidation() {
    return [
      check("first_name").trim().notEmpty().withMessage('فیلد نام نباید خالی باشد'),
      check("last_name").trim().notEmpty().withMessage('فیلد نام خانوادگی نباید خالی باشد'),
      check("email").trim().not().isEmpty().withMessage("فیلد ایمیل خالی است"),
      check("email")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد ایمیل نباید شامل فاصله باشد"),
      check("email").isEmail().withMessage("فیلد ایمیل معتبر نیست"),
      check("user_name")
        .trim()
        .notEmpty()
        .withMessage("فیلد نام کاربری خالی است"),
      check("user_name")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد نام کاربری نباید شامل فاصله باشد"),
      check("password")
        .trim()
        .notEmpty()
        .withMessage("فیلد رمز عبور خالی است"),
      check("password")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد رمز عبور نباید شامل فاصله باشد"),
    ];
  }
  loginValidation(){
    return [
      check("password")
        .trim()
        .notEmpty()
        .withMessage("فیل رمز عبور خالی است"),
      check("password")
        .custom((value) => !/\s/.test(value))
        .withMessage("فیلد رمز عبور نباید شامل فاصله باشد"),
    ]
  }
})();
