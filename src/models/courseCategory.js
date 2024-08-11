import mongoose from "mongoose";

const courseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uniqe: true,
  },
  title: {
    type: String,
    required: true,
    uniqe: true,
  },
});

const CourseCategory = mongoose.model("course-category", courseCategorySchema);

export default CourseCategory;
