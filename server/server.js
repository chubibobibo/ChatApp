import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

//express sessions and mongo store
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { UserModel } from "./models/UserSchema.js";

const app = express();

app.use(express.json()); //parses json data
app.use(cors());

/**Connection to database */
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

/** Store and express session config */
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  secret: process.env.MONGO_STORE_SECRET,
  touchAfter: 24 * 60 * 60, // time period in seconds(once every 24hrs)
});

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() * 1000 * 60 * 60 * 24 * 7, // 1 week validity of cookies
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// app.use((req, res, next) => {
//   console.log(req.user);
//     console.log(req.session);
//   next();
// });

/** middleware to initialize passport for incoming request */
/** passport session attaches the user created from passportJs to the req.session */
app.use(passport.initialize());
app.use(passport.session()); // allows persistent sessions creates  req.session obj.

passport.use(UserModel.createStrategy()); // allows passport to use local strategy plugin implemented in UserSchema

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

/**routes */
app.use("/api/auth/", authRoutes);

/**Error Handlers */
/** Not found error handler */
app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Page not found" });
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
