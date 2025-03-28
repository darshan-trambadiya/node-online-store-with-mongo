/**
 * Middleware to check if a user is authenticated.
 * If the user is not logged in, they will be redirected to the login page.
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next middleware function
 */
module.exports = (req, res, next) => {
  // Check if the user is logged in by verifying the session
  if (!req.session.isLoggedIn) {
    return res.redirect("/login"); // Redirect to the login page if not authenticated
  }

  // If the user is authenticated, proceed to the next middleware or route handler
  next();
};
