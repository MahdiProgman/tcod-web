import request from "supertest";
import api from "../api.js";
import { users } from "./data/data.json";

describe("/auth Router", () => {
  describe("/register Route", () => {
    it("should be create user and response have token and data of new user", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/auth/register")
        .send(users[0]);

      expect(statusCode).toEqual(200);
      expect(body.data).toMatchObject({
        email: users[0].email,
        user_name: users[0].user_name,
      });
    });
    it("should be send error beacuse given a email and the email for another user", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/auth/register")
        .send(users[1]);

      expect(statusCode).toEqual(400);
      expect(body.errors).toBeTruthy();
    });
    it("should be send error beacuse given a user name and the user name for another user", async () => {
      const { body, statusCode } = await request(api)
        .post("/api/auth/register")
        .send(users[2]);

      expect(statusCode).toEqual(400);
      expect(body.errors).toBeTruthy();
    });
  });
  describe("/login Route", () => {
    describe("login with email", () => {
      it("should be login with email and response have token and the user info", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            email: users[0].email,
            password: users[0].password,
          });

        expect(statusCode).toEqual(200);
        expect(body.data).toBeTruthy();
        expect(body.data).toMatchObject({
          full_name: {
            first_name: users[0].first_name,
            last_name: users[0].last_name,
          },
          email: users[0].email,
          user_name: users[0].user_name,
        });
      });
      it("should be send not found error becasue password is invalid", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            email: users[0].email,
            password: "wrong_pass",
          });

        expect(statusCode).toEqual(404);
        expect(body.data).toBeFalsy();
        expect(body.message).toBe("not found error");
      });
      it("should be send not found error because any user is not there with this email", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            email: "wrong_email",
            password: users[0].password,
          });

        expect(statusCode).toEqual(404);
        expect(body.data).toBeFalsy();
        expect(body.message).toBe("not found error");
      });
    });
    describe("login with user name", () => {
      it("should be login with user name and response have token and the user info", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            user_name: users[0].user_name,
            password: users[0].password,
          });

        expect(statusCode).toEqual(200);
        expect(body.data).toBeTruthy();
        expect(body.data).toMatchObject({
          full_name: {
            first_name: users[0].first_name,
            last_name: users[0].last_name,
          },
          email: users[0].email,
          user_name: users[0].user_name,
        });
      });
      it("should be send not found error becasue password is invalid", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            user_name: users[0].user_name,
            password: "wrong_pass",
          });

        expect(statusCode).toEqual(404);
        expect(body.data).toBeFalsy();
        expect(body.message).toBe("not found error");
      });
      it("should be send not found error because any user is not there with this user name", async () => {
        const { body, statusCode } = await request(api)
          .post("/api/auth/login")
          .send({
            user_name: "wrong_user_name",
            password: users[0].password,
          });

        expect(statusCode).toEqual(404);
        expect(body.data).toBeFalsy();
        expect(body.message).toBe("not found error");
      });
    });
    describe("login without enything", () => {
      it("should be send error and reponse code must be 400", async () => {
        const { body, statusCode } = await request(api)
        .post("/api/auth/login")
        .field("password", users[0].password);

        expect(statusCode).toEqual(400);
        expect(body.data).toBeFalsy();
      });
    });
  });
});
