import { connect, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import api from "../api.js";
import { teachers } from "./data/data.json";
import User from "../src/models/user.js";
import Permission from "../src/models/permission.js";
import { hash, genSalt } from "bcrypt";
import path from "path";
import { rmSync, mkdirSync } from "fs";
import CourseCategory from "../src/models/courseCategory.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connect(uri);

  const decryptedPass = await hash(teachers[0].password, await genSalt(3));
  const newTeacher = new User({
    full_name: {
      first_name: teachers[0].first_name,
      last_name: teachers[0].last_name,
    },
    user_name: teachers[0].user_name,
    email: teachers[0].email,
    password: decryptedPass,
  });
  const newPermissionForTeacher = new Permission({
    user: newTeacher,
    role: "teacher",
  });
  const newAdmin = new User({
    full_name: {
      first_name: teachers[0].first_name,
      last_name: teachers[0].last_name,
    },
    user_name: teachers[0].user_name,
    email: teachers[0].email,
    password: decryptedPass,
  });
  const newPermissionForAdmin = new Permission({
    user : 
  })

  const newCategory = new CourseCategory({
    name: "back-end",
    title : "بک اند"
  });

  await newCategory.save();

  await newPermissionForTeacher.save();

  newTeacher.permission = newPermissionForTeacher;

  await newTeacher.save();
});

afterAll(async () => {
  rmSync("./public/media/users", {
    recursive: true,
    force: true,
  });
  rmSync("./public/media/courses", {
    recursive: true,
    force: true,
  });

  mkdirSync("./public/media/users");
  mkdirSync("./public/media/courses");

  await connection.dropDatabase();
  await connection.close();
  await mongoServer.stop();
});

test("should be send not found", async () => {
  const { body, statusCode } = await request(api).get("/sdffadfa");

  expect(statusCode).toEqual(404);
  expect(body).toMatchObject({
    message: "Not Found",
  });
});
