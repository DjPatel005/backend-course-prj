// ======= Global Error Handlers (Top of the file) =======
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ❌", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION ❌", reason);
  process.exit(1);
});

// ======= Main App Code =======
try {
  const path = require("path");
  const { v4: uuidv4 } = require("uuid");
  const express = require("express");
  const bodyParser = require("body-parser");
  const multer = require("multer");
  const mongoose = require("mongoose");

  // Routers
  const authRouter = require("./routes/auth");
  const adminCategoryRouter = require("./routes/adminCategory");
  const adminCourseRouter = require("./routes/adminCourse");
  const adminSectionRouter = require("./routes/adminSection");
  const adminLessonRouter = require("./routes/adminLesson");
  const adminUserRouter = require("./routes/adminUser");
  const adminOrderRouter = require("./routes/adminOrder");
  const clientRouter = require("./routes/client");
  const reportRouter = require("./routes/report");

  const app = express();
  const port = process.env.PORT || 9000;

  const MONGODB_URI = process.env.MONGO_URI;
  if (!MONGODB_URI) throw new Error("MONGO_URI is not defined");

  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/images", express.static(path.join(__dirname, "images")));

  // CORS
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, userId, adminRole, userRole"
    );
    next();
  });

  // Routers
  app.use("/auth", authRouter);
  app.use("/admin", adminCategoryRouter);
  app.use("/admin", adminCourseRouter);
  app.use("/admin", adminSectionRouter);
  app.use("/admin", adminLessonRouter);
  app.use("/admin", adminUserRouter);
  app.use("/admin", adminOrderRouter);
  app.use("/admin", reportRouter);
  app.use(clientRouter);

  // Error middleware
  app.use((error, req, res, next) => {
    console.error("Express error:", error);
    res.status(error.statusCode || 500).json({
      message: error.message,
      errorType: error.errorType || "unknown",
      data: error.data,
    });
  });

  // Mongo connection
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("MongoDB Connected ✅");
      app.listen(port, () => {
        console.log(`App listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB ERROR ❌", err);
      process.exit(1);
    });
} catch (err) {
  console.error("APP FAILED TO START ❌", err);
  process.exit(1);
}
