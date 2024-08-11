import User from "./../models/user.js";
import config from "config";
import jwt from "jsonwebtoken";

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
        req.user = decoddedToken;
        next();
      } else {
        res.status(400).json({
          message: "invalid error",
          errors: [
            {
              field: "authorization",
              error: "توکن معتبر نمی باشد",
            },
          ],
        });
      }
    } else {
      res.status(403).json({
        code: 400,
        message: "invalid error",
        errors: [
          {
            field: "authorization",
            error: "توکن معتبر نمی باشد",
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