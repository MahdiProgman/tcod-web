import mongoose from "mongoose";
import config from "config";
import logger from "./logger.js";

export default function connectToDB() {
  mongoose.connect(config.get("db.address"))
    .then(() => logger.info("Server Is Connected to MongoDB Successfully!"))
    .catch(() => logger.error("Server Couldn't Connected to MongoDB!"));
}
