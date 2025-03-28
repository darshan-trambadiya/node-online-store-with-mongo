// Import required modules
const { validationResult } = require("express-validator");

// Import custom controllers and models
const { getNodemailerTransport } = require("../utils/common");

const transporter = getNodemailerTransport();

/**
 * Renders the "About Us" page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getAboutUs = (req, res, next) => {
  res.render("info/about-us", {
    pageTitle: "About Us",
    path: "/about-us",
  });
};

/**
 * Renders the "Contact Us" page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.getContactUs = (req, res, next) => {
  const successMessage = req.flash("sendContactUsMsgSuccess")[0] || null;

  res.render("info/contact-us", {
    pageTitle: "Contact Us",
    path: "/contact-us",
    successMessage,
    oldInput: { name: "", email: "", subject: "", phone: "", message: "" },
    validationErrors: [],
  });
};

/**
 * Handles the submission of the "Contact Us" form.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
exports.postSendContactUsMessage = async (req, res, next) => {
  const { name, email, subject, phone, message } = req.body;

  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("info/contact-us", {
      pageTitle: "Contact Us",
      path: "/contact-us",
      successMessage: null,
      oldInput: { name, email, subject, phone, message },
      validationErrors: errors.array(),
    });
  }

  try {
    // Send inquiry email
    await transporter.sendMail({
      to: "inquiry@eshop.com",
      from: email,
      subject: `Got New Inquiry From ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #85ba46; text-align: center;">New Inquiry Received</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <div style="margin-bottom: 10px;">
              <b>Name:</b> <span>${name}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <b>Email:</b> <span>${email}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <b>Subject:</b> <span>${subject}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <b>Phone No:</b> <span>${phone}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <b>Message:</b> <span>${message}</span>
            </div>
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="mailto:${email}" style="display: inline-block; padding: 10px 20px; background-color: #85ba46; color: #fff; text-decoration: none; border-radius: 5px;">Reply to ${name}</a>
          </p>
        </div>
      `,
    });

    // Flash success message and redirect
    req.flash(
      "sendContactUsMsgSuccess",
      "Thank you for reaching out! Your message has been successfully sent. We will get back to you as soon as possible."
    );
    res.redirect("/contact-us");
  } catch (err) {
    const error = new Error(
      "Something went wrong while sending the contact us email!"
    );
    error.httpStatusCode = 500;
    return next(error);
  }
};
