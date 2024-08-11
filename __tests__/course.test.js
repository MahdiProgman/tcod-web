import request from "supertest";
import path from "path";
import jwt from "jsonwebtoken";
import api from "../api.js";
import config from "config";
import { courses, teachers, disscounts } from "./data/data.json";
import User from "../src/models/user.js";
import moment from "jalali-moment";

let token;
let courseId;

beforeAll(async () => {
  const teacherFound = await User.findOne({ user_name: teachers[0].user_name });
  token = jwt.sign(
    { _id: teacherFound._id, email: teacherFound.email },
    config.get("private_key")
  );
});

describe("/courses Router", () => {
  describe("/ Route", () => {
    it("should be send courses data", async () => {
      const { body, statusCode } = await request(api).get("/api/courses");
      expect(statusCode).toEqual(200);
      expect(body.data).toHaveProperty("page", 1);
      expect(body.data).toHaveProperty("pagesCount", 1);
    });
  });
  describe("/category/create Route", () => {
    it("should be create category for courses and statusCode to be 200", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/courses/category/create")
        .set("Authorization", token)
        .field("name", "front-end")
        .field("title", "فرانت اند");

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
    });
  });
  describe("/create Route", () => {
    it("should be create a course and send response with the course data", async () => {
      expect(token).toBeTruthy();

      const { body, statusCode } = await request(api)
        .post("/api/courses/create")
        .set("Authorization", token)
        .field("name", courses[0].name)
        .field("title", courses[0].title)
        .field("category", courses[0].category)
        .field("description", courses[0].description)
        .field("viewType", courses[0].viewType)
        .field("requirements", courses[0].requirements)
        .field("courseStatus", courses[0].courseStatus)
        .field("supportType", courses[0].supportType)
        .attach(
          "thumbnail",
          path.join(__dirname, "/data/files/courses/1/thumbnail/thumbnail.jpg")
        );

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();

      courseId = body.data._id;
    });
    it("should be send error because thumbnail file is not sendded", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/courses/create")
        .set("Authorization", token)
        .send(courses[0]);

      expect(statusCode).toEqual(400);
      expect(body.data).toBeFalsy();
      expect(body.message).toBe("validation error");
    });
    it("should be send error because the thumbnail file sended is not a image file", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/courses/create")
        .set("Authorization", token)
        .field("name", courses[0].name)
        .field("title", courses[0].title)
        .field("category", courses[0].category)
        .field("description", courses[0].description)
        .field("viewType", courses[0].viewType)
        .field("requirements", courses[0].requirements)
        .field("courseStatus", courses[0].courseStatus)
        .field("supportType", courses[0].supportType)
        .attach(
          "thumbnail",
          path.join(__dirname, "/data/files/courses/1/thumbnail/thumbnail.ajs")
        );

      expect(statusCode).toEqual(400);
      expect(body.data).toBeFalsy();
      expect(body.message).toBe("validation error");
    });
    it("should be send error beacuse the category is not inside on DB", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/courses/create")
        .set("Authorization", token)
        .field("name", courses[0].name)
        .field("title", courses[0].title)
        .field("category", "unkown-category")
        .field("description", courses[0].description)
        .field("viewType", courses[0].viewType)
        .field("requirements", courses[0].requirements)
        .field("courseStatus", courses[0].courseStatus)
        .field("supportType", courses[0].supportType)
        .attach(
          "thumbnail",
          path.join(__dirname, "/data/files/courses/1/thumbnail/thumbnail.jpg")
        );

      expect(statusCode).toEqual(404);
      expect(body.data).toBeFalsy();
      expect(body.message).toBe("not found error");
    });
  });
  describe("/edit Route", () => {
    it("should be edit course data and response code to be 200", async () => {
      const { statusCode, body } = await request(api)
        .put("/api/courses/edit")
        .set("Authorization", token)
        .send({
          name: courses[1].name,
          title: courses[1].title,
          category: courses[1].category,
          description: courses[1].description,
          viewType: courses[1].viewType,
          supportType: courses[1].supportType,
          requirements: courses[1].requirements,
          courseStatus: courses[1].courseStatus,
        });

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
      expect(body.errors).toEqual([]);
    });
    it("should be edit course(and category) and response to be 200", async () => {
      const { statusCode, body } = await request(api)
        .put("/api/courses/edit")
        .set("Authorization", token)
        .send({
          name: courses[1].name,
          title: courses[1].title,
          category: "back-end",
          description: courses[1].description,
          viewType: courses[1].viewType,
          supportType: courses[1].supportType,
          requirements: courses[1].requirements,
          courseStatus: courses[1].courseStatus,
        });

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
      expect(body.errors).toEqual([]);
    });
    it("should be send error because course is not on DB", async () => {
      const { body, statusCode } = await request(api)
        .put("/api/courses/edit")
        .set("Authorization", token)
        .send({
          name: "unkown-course",
          title: courses[1].title,
          category: courses[1].category,
          description: courses[1].description,
          viewType: courses[1].viewType,
          supportType: courses[1].supportType,
          requirements: courses[1].requirements,
          courseStatus: courses[1].courseStatus,
        });

      expect(statusCode).toEqual(404);
      expect(body.message).toBe("not found error");
      expect(body.data).toBeFalsy();
    });
    it("should be send error because category is not on DB", async () => {
      const { body, statusCode } = await request(api)
        .put("/api/courses/edit")
        .set("Authorization", token)
        .send({
          name: courses[0].name,
          title: courses[1].title,
          category: "unkown-category",
          description: courses[1].description,
          viewType: courses[1].viewType,
          supportType: courses[1].supportType,
          requirements: courses[1].requirements,
          courseStatus: courses[1].courseStatus,
        });

      expect(statusCode).toEqual(400);
      expect(body.data).toBeFalsy();
      expect(body.message).toEqual("validation error");
    });
  });
  describe("/thumbnail", () => {
    it("should be change the thumbnail of course and response code must be 200", async () => {
      const { body, statusCode } = await request(api)
        .put("/api/courses/thumbnail")
        .set("Authorization", token)
        .field("courseId", courseId)
        .attach(
          "thumbnail",
          path.join(
            __dirname,
            "/data/files/courses/1/thumbnail/newThumbnail.jpg"
          )
        );

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
      expect(body.errors).toEqual([]);
    });
  });
  describe("/seasons/create Route", () => {
    it("should be create season for the course and statusCode must be 200", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/courses/seasons/create")
        .set("Authorization", token)
        .send({
          title: "Context in React",
          courseId,
        });

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
    });
  });
  describe("/disscount/create Route", () => {
    it("should be create disscount for a course and statusCode must be 200", async () => {
      const disscount = disscounts[0];
      const miladiDate = new Date();
      miladiDate.setSeconds(15 * 60);
      miladiDate = {
        day : miladiDate.g
      }
      disscount.startDisscountDate = moment()
      const { body, statusCode } = 2;
    });
  });
  describe("/:name Route", () => {
    it("should be send a course with the name", async () => {
      const { body, statusCode } = await request(api).get(
        `/api/courses/${courses[0].name}`
      );

      expect(statusCode).toEqual(200);
      expect(body.data).toBeTruthy();
      expect(body.data).toMatchObject({
        name: courses[0].name,
      });
    });
    it("should be send error because in DB any course is not inside with the name", async () => {
      const { body, statusCode } = await request(api).get(
        "/api/courses/random-name"
      );

      expect(statusCode).toEqual(404);
      expect(body.data).toBeFalsy();
      expect(body.message).toBe("not found error");
    });
  });
});
