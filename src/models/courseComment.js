import mongoose from "mongoose";
import moment from "jalali-moment";

const courseCommentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "course",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rate: {
    type: Number,
    default: null,
    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  },
  text: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Types.ObjectId,
    ref: "course-comment",
    default: null,
  },
  replyMsg: {
    type: mongoose.Types.ObjectId,
    ref: "course-comment",
    default: null,
  },
  createdAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
});

courseCommentSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

const CourseComment = mongoose.model("course-comment", courseCommentSchema);

export default CourseComment;
