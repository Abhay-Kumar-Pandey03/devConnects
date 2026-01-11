require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
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
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const adminRouter = require("./routes/admin");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestsRouter);
app.use("/api", userRouter);
app.use("/api", paymentRouter);
app.use("/api", chatRouter);
app.use("/api", adminRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    server.listen(process.env.PORT, () => {
      console.log("Server is successfully running on port");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected !!");
  });

  