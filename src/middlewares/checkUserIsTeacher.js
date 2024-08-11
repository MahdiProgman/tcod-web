import jwt from "jsonwebtoken";
import config from "config";
import Permission from "../models/permission.js";
import User from "../models/user.js";

export default async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token) {
    const decoddedToken = jwt.verify(token, config.get("private_key"));
    if (decoddedToken) {
      const userFound = await User.findOne({
        _id: decoddedToken._id,
        email: decoddedToken.email,
      });
      if (userFound) {
        const permissionFound = await Permission.find({
          user: userFound,
        });
        if (permissionFound) {
          req.user = decoddedToken;
          next();
        } else {
          res.status(403).json({
            code: 400,
            message: "permission error",
            errors: [
              {
                field: "authorization",
                error: "کاربر مدنظر شامل سطح دسترسی معلم نمی باشد",
              },
            ],
          });
        }
      } else {
        res.status(404).json({
          code: 404,
          message: "not found error",
          errors: [
            {
              field: "authorization",
              error: "فیلد توکن معتبر نیست",
            },
          ],
        });
      }
    } else {
      res.status(403).json({
        code : 400,
        message: "invalid error",
        errors: [
          {
            field: "authorization",
            error: "فیلد توکن معتبر نیست",
          },
        ],
      });
    }
  } else {
    res.status(403).json({
      code: 400,
      message: "token is not provided",
      errors: [
        {
          field: "authorization",
          error: "توکن خالی است یا وارد نشده",
        },
      ],
    });
  }
};