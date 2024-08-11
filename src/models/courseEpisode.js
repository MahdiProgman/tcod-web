import mongoose from "mongoose";
import moment from "jalali-moment";
import CourseComment from "./courseComment.js";
import CourseSeason from "./courseSeason.js";

const courseEpisodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    uniqe: true,
  },
  description: {
    type: String,
    required: true,
    uniqe: true,
  },
  video: {
    type: String,
    required: true,
    uniqe: true,
  },
  season: {
    type: mongoose.Types.ObjectId,
    ref: "course-season",
    required: true,
  },
  episode: {
    type: Number,
    required: true,
  },
  comments: [CourseComment.schema],
  createdAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
  updatedAt: {
    type: String,
    default: moment().format("jYYYY/jMM/jDD"),
  },
});

courseEpisodeSchema.pre("save", function (){
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
});

const CourseEpisode = mongoose.model("course-episode", courseEpisodeSchema);

export default CourseEpisode;