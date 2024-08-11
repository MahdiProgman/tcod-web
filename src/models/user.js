import mongoose from "mongoose";
import moment from "jalali-moment";

const userSchema = new mongoose.Schema({
  full_name : {
    first_name : {
      type : String,
      required : true
    },
    last_name : {
      type : String,
      required : true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  permission: {
    type : mongoose.Types.ObjectId,
    ref : 'permission',
    default : null
  },
  cart: [
    {
      type : mongoose.Types.ObjectId,
      ref : 'course'
    }
  ],
  tickets : [
    {
      type : mongoose.Types.ObjectId,
      ref : 'ticket'
    }
  ],
  courses : [
    {
      type : mongoose.Types.ObjectId,
      ref : 'course'
    }
  ],
  teacherCourses : [
    {
      type : mongoose.Types.ObjectId,
      ref : 'course'
    }
  ],
  emailVerified : {
    type : Boolean,
    default : false
  },
  createdAt : {
    type : String,
    default : moment().format('jYYYY/jMM/jDD')
  },
  updatedAt : {
    type : String,
    default : moment().format('jYYYY/jMM/jDD')
  }
});



const User = mongoose.model("user", userSchema);

userSchema.pre('save', function (next) {
  this.updatedAt = moment().format('jYYYY/jMM/jDD');
  next();
});

export default User;