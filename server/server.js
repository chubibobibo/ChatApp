import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import cors from "cors";

const app = express();

app.use(express.json); //parses json data
app.use(cors());

/**Connection to database */
// getting-started.js
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

/** Not found error handler */
mongodb: app.use("*", (req, res) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Page not foundz" });
});

/** Express error handling */
app.use((err, req, res, next) => {
  const status = err.status || StatusCodes.BAD_REQUEST;
  const message = err.message || "Something went wrong";
  res.status(status).json({ message: message });
});

app.listen(process.env.PORT, () => {
  console.log(`SERVING PORT ${process.env.PORT}`);
});
