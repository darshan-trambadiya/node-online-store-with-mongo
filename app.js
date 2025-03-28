// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

// Import route handlers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const infoRoutes = require("./routes/info");

// Import custom controllers and models
const errorController = require("./controllers/error");
const User = require("./models/user");

// constants
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
const SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;
const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Configure session store using MongoDB
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// CSRF protection middleware
const csrfProtection = csrf();

// Configure multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Save files in the 'images' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`); // Unique filename
  },
});

// File filter for multer to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  cb(null, allowedMimeTypes.includes(file.mimetype));
};

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash());

// Global Middleware for CSRF Protection and Authentication Status
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware to Attach User to Request
app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err) {
    next(new Error(err));
  }
});

// Route Handlers
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(infoRoutes);

// Error Handling Routes
app.get("/500", errorController.get500);
app.use(errorController.get404);

// Centralized Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// Database Connection and Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `=========> ✅ Server running on port ${PORT}, connected to MongoDB`
      )
    );
  })
  .catch((err) =>
    console.error("=========> ❌ MongoDB Connection Error:", err)
  );
