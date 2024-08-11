import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import controller from "./../controller.js";
import User from "./../../models/user.js";
import Ticket from "./../../models/ticket.js";
import hashData from "../../utils/hashData.js";
import Course from "../../models/course.js";
import CourseComment from "../../models/courseComment.js";
import nodeMailer from "nodemailer";
import ActivationCode from "../../models/activationCode.js";
import getHTMLEmailVerification from "../../utils/getHTMLEmailVerification.js";

export default new (class extends controller {
  async getUserInformation(req, res) {
    const userFound = await User.findById(req.user._id);
    this.response({
      data: userFound,
      res,
    });
  }
  async editUserInformation(req, res) {
    const { first_name, last_name, email, user_name } = req.body;

    const userFound = await User.findById(req.user._id)
      .populate("ticket")
      .populate("course")
      .populate("payment")
      .populate("permission");

    userFound.email = email;
    userFound.user_name = user_name;
    userFound.first_name = first_name;
    userFound.last_name = last_name;

    await userFound.save();

    this.response({
      data: userFound,
      res,
    });
  }
  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;

    const userFound = await User.findById(req.user._id)
      .populate("ticket")
      .populate("course")
      .populate("payment")
      .populate("permission");

    const isPassMatch = await bcrypt.compare(userFound.password, oldPassword);

    if (isPassMatch) {
      const hashedPass = await hashData(newPassword);

      userFound.password = hashedPass;

      await userFound.save();

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "not match error",
        errors: [
          {
            field: "oldPassword",
            error: "فیلد رمز عبور قدیمی با رمز عبور فعلی همخوانی ندارد",
          },
        ],
        res,
      });
    }
  }
  async sendTicket(req, res) {
    const { title } = req.body;

    const userFound = await User.findById(req.user._id)
      .populate("ticket")
      .populate("course")
      .populate("payment")
      .populate("permission");

    const newTicket = new Ticket({
      user: userFound,
      title,
      text,
    });

    userFound.tickets.push(newTicket);

    await newTicket.save();
    await userFound.save();

    this.response({
      data: userFound,
      res,
    });
  }
  async getTickets(req, res) {
    const limit = parseInt(req.params.limit) || 10;
    const page = parseInt(req.params.page) || 1;

    const tickets = await Ticket.find()
      .populate("user")
      .populate("ticket")
      .limit(limit)
      .skip((page - 1) * limit);

    const ticketsCount = await Ticket.countDocuments();

    let pagesCount = 1;

    if (ticketsCount > 10) pagesCount = ticketsCount / 10;

    tickets.forEach(async (ticket) => {
      if (ticket.replyTicket && ticket.replyTicket.ticketStatus == 0) {
        ticket.replyTicket.ticketStatus = 1;
      }
      if (ticket.replyToTicket.user._id == req.user._id) {
        ticket.ticketStatus = 1;
      }
      await ticket.save();
    });

    this.response({
      data: {
        tickets,
        page,
        pagesCount,
      },
      res,
    });
  }
  async uploadImageToProfile(req, res) {
    let profileImage;
    try {
      profileImage = req.files.profileImage;
    } catch {
      profileImage = null;
    }
    if (profileImage) {
      const { profileImage } = req.body;

      fs.rmSync(`./public/media/users/${req.user._id}/profile`, {
        recursive: true,
        force: true,
      });
      fs.mkdir(`./public/media/users/${req.user._id}/profile`);
      profileImage.mv(
        `./public/media/users/${req.user._id}/profile/profile${path.extname(
          profileImage.name
        )}`
      );

      const userFound = await User.findById(req.user._id)
        .populate("ticket")
        .populate("course")
        .populate("payment")
        .populate("permission");

      userFound.profile = `/media/users/${
        req.user._id
      }/profile/profile${path.extname(profileImage.name)}`;

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "profileImage",
            error: "تصویری برای آپلود ارسال نشده",
          },
        ],
        res,
      });
    }
  }
  async emailVerification(req, res) {
    const userFound = await User.findById(req.user._id);
    console.log(userFound.emailVerified);
    if (!userFound.emailVerified) {
      const randomCode =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASS,
        },
      });

      let emailOption = {
        from: process.env.EMAIL_ADDRESS,
        to: userFound.email,
        subject: "TCOD",
        html: getHTMLEmailVerification(randomCode),
      };

      const activationCode = new ActivationCode({
        code: randomCode,
        email: userFound.email,
      });

      await activationCode.save();

      try {
        transporter.sendMail(emailOption);
        this.response({
          res,
        });
      } catch {
        this.response({
          code : 502,
          message : 'a problem ocurred while sending email',
          errors : [
            {
              field : 'Authorization',
              error : 'مشکلی در ارسال ایمیل پیش آمد دوباره تلاش کنید'
            }
          ],
          res
        });
      }
    } else {
      this.response({
        code: 400,
        message: "email is verified",
        errors: [
          {
            field: "Authorization",
            error: "ایمیل کاربر قبلا تایید شده",
          },
        ],
        res,
      });
    }
  }
  async verifyEmail(req, res) {
    const { code } = req.body;
    const codeFound = await ActivationCode.findOne({ code });
    if (codeFound) {
      const userFound = await User.findById(req.user._id);

      userFound.emailVerified = true;

      await userFound.save();
      await ActivationCode.deleteOne({
        email: userFound.email,
        code,
      });

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "code is invalid",
        errors: [
          {
            field: "code",
            error: "کد تایید اییمل نادرست است",
          },
        ],
        res,
      });
    }
  }
  async addCourseToCart(req, res) {
    const { courseId } = req.body;
    const userFound = await User.findById(req.user._id)
      .populate("ticket")
      .populate("course")
      .populate("payment")
      .populate("permission");

    const courseFound = await Course.findById(courseId);

    if (courseFound) {
      userFound.cart.push(courseFound);
      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "courseId",
            error: "دوره ای با آیدی مورد نظر پیدا نشد",
          },
        ],
        res,
      });
    }
  }
  async deleteCourseFromCart(req, res) {
    const { courseId } = req.body;
    const userFound = await User.findById(req.user._id);

    let courseFoundFromCart = null;

    for (let course of userFound.cart) {
      if (course._id == courseId) {
        courseFoundFromCart = course;
      }
    }

    if (courseFoundFromCart) {
      userFound.cart = userFound.cart.filter((val) => val._id !== courseId);

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "courseId",
            error: "دوره ای با این آیدی وجود ندارد",
          },
        ],
        res,
      });
    }
  }
  async buyAnyCourseInCart(req, res) {
    const userFound = await User.findById(req.user._id);

    if (userFound.cart.length != 0) {
      for (let course of userFound.cart) {
        userFound.courses.push(course);
      }

      await userFound.save();

      this.response({
        data: userFound,
        res,
      });
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "Authorization",
            error: "سبد خرید کاربر خالی است",
          },
        ],
        res,
      });
    }
  }
  async addCommentToCourse(req, res) {
    const { text, courseId } = req.body;
    let replyTo;
    try {
      replyTo = req.body.replyTo;
    } catch {
      replyTo = null;
    }
    const courseFound = await Course.findById(courseId);

    if (courseFound) {
      const userFound = await User.findById(req.user._id);
      if (replyTo) {
        const commentFound = await CourseComment.findById(replyTo);
        if (commentFound) {
          const newComment = new CourseComment({
            course: courseFound,
            replyTo: commentFound,
            text,
            user: userFound,
          });

          courseFound.comments.push(newComment);
          commentFound.replyMsg = newComment;

          await newComment.save();
          await courseFound.save();
          await commentFound.save();

          this.response({
            data: newComment,
            res,
          });
        } else {
          this.response({
            code: 404,
            message: "not found error",
            errors: [
              {
                field: "replyTo",
                error: "کامنتی با آیدی مدنظر یافت نشد",
              },
            ],
            res,
          });
        }
      } else {
        let rate;
        try {
          rate = req.body;
        } catch {
          rate = null;
        }

        if (rate) {
          const newComment = new CourseComment({
            course: courseFound,
            rate,
            text,
            user: userFound,
          });

          courseFound.comments.push(newComment);

          let newRate = 0;

          for (let comment of courseFound.comments) {
            newRate += comment.rate;
          }

          newRate = newRate / courseFound.comments.length;

          courseFound.rating = newRate;

          await newComment.save();
          await courseFound.save();

          this.response({
            data: newComment,
            res,
          });
        } else {
          this.response({
            code: 400,
            message: "validation error",
            errors: [
              {
                field: "rate",
                error: "فیلد ریت  یا نرخ نباید خالی باشد",
              },
            ],
            res,
          });
        }
      }
    } else {
      this.resposne({
        code: 404,
        message: "not found error",
        errors: [
          {
            field: "courseId",
            error: "دوره ای با آیدی مدنظر یافت نشد",
          },
        ],
        res,
      });
    }
  }
})();
