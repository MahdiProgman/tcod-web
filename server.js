// The Point Where The Program Is Executed //
// Import Requirements
import dotenv from "dotenv";
import connectToDB from './src/utils/connectToDB.js';
import logger from "./src/utils/logger.js";

// import a configured express app
import api from './api.js';

// Make Connection With Database
dotenv.config();

connectToDB();

// a port for the server
const port = process.env.PORT || 3000; 

// listen on port
api.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

export default api;