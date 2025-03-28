// Import required modules
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Import custom controllers and models
const { getNodemailerTransport } = require("../utils/common");
const User = require("../models/user");

const transporter = getNodemailerTransport();

/**
 * Renders the login page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getLogin = (req, res, next) => {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

/**
 * Renders the signup page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getSignup = (req, res, next) => {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

/**
 * Handles the submission of the login form.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password.",
        oldInput: { email, password },
        validationErrors: [],
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password.",
        oldInput: { email, password },
        validationErrors: [],
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

/**
 * Handles the submission of the signup form.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    res.redirect("/login");

    // Send signup success email
    await transporter.sendMail({
      to: email,
      from: "info@eshop.com",
      subject: "Signup Succeeded!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
          <h1 style="color: #85ba46;">Welcome to E-Shop!</h1>
          <p>You have successfully signed up for an account.</p>
          <p>Start exploring our products and enjoy your shopping experience!</p>
          <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; background-color: #85ba46; color: #fff; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
      `,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

/**
 * Handles user logout.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

/**
 * Renders the password reset page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getReset = (req, res, next) => {
  const errorMessage = req.flash("error")[0] || null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage,
  });
};

/**
 * Handles the submission of the password reset form.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash("error", "No account with that email found.");
        return res.redirect("/reset");
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
      await user.save();

      res.redirect("/");

      // Send password reset email
      await transporter.sendMail({
        to: req.body.email,
        from: "info@eshop.com",
        subject: "Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
            <h1 style="color: #85ba46;">Password Reset Request</h1>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            <a href="http://localhost:3000/reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #85ba46; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
};

/**
 * Renders the new password page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Invalid or expired token.");
      return res.redirect("/reset");
    }

    const errorMessage = req.flash("error")[0] || null;

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

/**
 * Handles the submission of the new password form.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      req.flash("error", "Invalid or expired token.");
      return res.redirect("/reset");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
