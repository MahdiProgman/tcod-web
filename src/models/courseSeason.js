import mongoose from "mongoose";
import Course from "./course.js";
import CourseEpisode from "./courseEpisode.js";

const courseSeasonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    uniqe: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "course",
    required: true,
  },
  season: {
    type: Number,
    required: true,
  },
  episodes: [CourseEpisode.schema],
});

const CourseSeason = mongoose.model("course-season", courseSeasonSchema);

export default CourseSeason;