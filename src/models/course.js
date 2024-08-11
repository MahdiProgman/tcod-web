import moment from "jalali-moment";
import mongoose from "mongoose";
import User from "./user.js";
import CourseSeason from "./courseSeason.js";
import courseArticle from "./courseArticle.js";
import CourseCategory from "./courseCategory.js";
import CourseComment from "./courseComment.js";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    uniqe: true,
  },
  category: CourseCategory.schema,
  thumbnail: {
    type: String,
    uniqe: true,
    required: true,
  },
  disscount : {
    type : mongoose.Types.ObjectId,
    ref : 'disscount'
  },
  article: courseArticle.schema,
  students: {
    number: {
      type: Number,
      default: 0,
    },
    students: [User.schema],
  },
  comments : [CourseComment.schema],
  rating: {
    type: Number,
    default: 5,
  },
  description: {
    type: String,
    required: true,
    uniqe: true,
  },
  seasons: [CourseSeason.schema],
  courseInstructor: User.schema,
  createdAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
  properties: {
    viewType: {
      type: Number,
      default: 0,
    },
    supportType: {
      type: Number,
      default: 0,
    },
    requirements: {
      type: String,
      default: "ندارد",
    },
    courseStatus: {
      type: Number,
      default: 0,
    },
  },
});

courseSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

const Course = mongoose.model("course", courseSchema);

export default Course;