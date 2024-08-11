import mongoose from "mongoose";
import moment from "jalali-moment";

const courseArticleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "course",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  files: [
    {
      url : {
        type : String
      }
    },
  ],
  createdAt : {
    type : String,
    default : moment().format('jYYYY/jMM/jDD')
  }
});

courseArticleSchema.pre("save", function (next) {
  this.updatedAt = moment().format("jYYYY/jMM/jDD");
  next();
});

const CourseArticle = mongoose.model("course-article", courseArticleSchema);

export default CourseArticle;
