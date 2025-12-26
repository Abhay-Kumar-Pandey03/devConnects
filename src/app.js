require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("./utils/cronjob");



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestsRouter);
app.use("/api", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT, () => {
      console.log("Server is successfully running on port");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected !!");
  });

  