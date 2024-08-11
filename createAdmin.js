import User from "../src/models/user";
import Permission from "../src/models/permission";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import config from "config";

const adminData = {
  full_name: {
    first_name: "امیر",
    last_name: "خانجانی",
  },
  email: "amirprogrammer38@gmail.com",
  user_name: "amirkhanjani123",
  password: "amirKhanjani123",
};

(async () => {
  mongoose.connect(config.get("db.address"));

  const adminFound = await User.findOne({
    email: adminData.email,
    user_name: adminData.user_name,
  });

  if (!adminFound) {
    const salt = await bcrypt.genSalt(3);
    const cryptedPass = await bcrypt.hash(adminData.password, salt);

    const newAdmin = new User({
      full_name: adminData.full_name,
      email: adminData.email,
      user_name: adminData.user_name,
      password: cryptedPass,
    });

    const newPermission = new Permission({
      user: newAdmin,
      role: "admin",
    });

    newAdmin.permission = newPermission;

    await newPermission.save();
    await newAdmin.save();

    console.log("Admin Is Created Successfully!");
  } else {
    throw new Error("Admin Is Exists On DB Currently!");
  }
})();
