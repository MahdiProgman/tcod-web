import fs from "fs";
import controller from "./../controller.js";
import User from "./../../models/user.js";
import hashData from "../../utils/hashData.js";
import createToken from "../../utils/createToken.js";
import bcrypt from "bcrypt";

export default new (class extends controller {
  async register(req, res) {
    const { first_name, last_name, email, user_name, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { user_name }] });

    if (userExists) {
      if (userExists.email == email) {
        this.response({
          code: 400,
          message: "exists error",
          errors: [
            {
              field: "email",
              error: "کاربری با این ایمیل موجود است",
            },
          ],
          res,
        });
      } else if (userExists.user_name == user_name) {
        this.response({
          code: 400,
          message: "exists error",
          errors: [
            {
              field: "user_name",
              error: "کاربری با این نام کاربری موجود است",
            },
          ],
          res,
        });
      }
    } else {
      const hashedPass = await hashData(password);

      const newUser = new User({
        email,
        user_name,
        password: hashedPass,
        full_name: {
          first_name,
          last_name,
        },
      });

      fs.mkdirSync(`./public/media/users/${newUser._id}`);
      fs.mkdirSync(`./public/media/users/${newUser._id}/profile`);

      await newUser.save();
      const token = createToken({ email, _id: newUser._id });

      this.response({
        data: newUser,
        token,
        res,
      });
    }
  }
  async login(req, res) {
    if (req.body.email) {
      const { email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) {
        const isPassMatch = await bcrypt.compare(password, userExists.password);
        if (isPassMatch) {
          const token = createToken({
            email: userExists.email,
            _id: userExists._id,
          });
          this.response({
            data: userExists,
            token,
            res,
          });
        } else {
          this.response({
            code: 404,
            message: "not found error",
            errors: [
              {
                field: "email",
                error: "ایمیل یا رمز عبور اشتباه است",
              },
              {
                field: "password",
                error: "ایمیل یا رمز عبور اشتباه است",
              },
            ],
            res,
          });
        }
      } else {
        this.response({
          code: 404,
          message: "not found error",
          errors: [
            {
              field: "email",
              error: "ایمیل یا رمز عبور اشتباه است",
            },
            {
              field: "password",
              error: "ایمیل یا رمز عبور اشتباه است",
            },
          ],
          res,
        });
      }
    } else if (req.body.user_name) {
      const { user_name, password } = req.body;
      const userExists = await User.findOne({ user_name });
      if (userExists) {
        const isPassMatch = await bcrypt.compare(password, userExists.password);
        if (isPassMatch) {
          const token = createToken({
            email: userExists.email,
            _id: userExists._id,
          });
          this.response({
            data: userExists,
            token,
            res,
          });
        } else {
          this.response({
            code: 404,
            message: "not found error",
            errors: [
              {
                field: "user_name",
                error: "نام کاربری یا رمز عبور اشتباه است",
              },
              {
                field: "password",
                error: "نام کاربری یا رمز عبور اشتباه است",
              },
            ],
            res,
          });
        }
      } else {
        this.response({
          code: 404,
          message: "not found error",
          errors: [
            {
              field: "user_name",
              error: "نام کاربری یا رمز عبور اشتباه است",
            },
            {
              field: "password",
              error: "نام کاربری یا رمز عبور اشتباه است",
            },
          ],
          res,
        });
      }
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "email",
            error: "نام کاربری یا ایمیل خود را وارد نکرده اید",
          },
          {
            field: "user_name",
            error: "نام کاربری یا ایمیل خود را وارد نکرده اید",
          },
        ],
        res,
      });
    }
  }
})();
