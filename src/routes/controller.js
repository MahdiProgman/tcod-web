import autoBind from "auto-bind";
import { validationResult } from "express-validator";

export default class {
  constructor() {
    autoBind(this);
  }

  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const messages = [];
      errors.forEach((err) => messages.push({field : err.path, error : err.msg}));
      this.response({
        code: 400,
        message: "validation error",
        errors : messages,
        res
      });
      return false;
    } else {
      return true;
    }
  }

  validate(req, res, next) {
    if (!this.validationBody(req, res)) {
      return;
    } else {
      next();
    }
  }

  response({
    code = 200,
    data = null,
    token = null,
    message = "عملیات موفقیت آمیز بود!",
    errors = [],
    res,
  }) {
    res.status(code).json({
      data,
      token,
      message,
      errors,
    });
  }
};
