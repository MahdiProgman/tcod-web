import request from "supertest";
import api from "../api.js";

describe("/GET Not Found", () => {
  it("should return 404", async () => {
    const response = await request(api).get("/dsafdsafasf");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: "Not Found",
    });
  });
});