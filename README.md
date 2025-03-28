# 🛒 E-Shop: A Full-Featured E-Commerce Platform

This project is a fully functional E-Shop built using **Node.js** and a suite of modern libraries and tools. It provides a seamless shopping experience with features like **user authentication, product management, cart functionality, secure payments, and order tracking.**

## 🚀 Key Features

### 🔐 User Authentication

- Users can **sign up** with email, password, and confirm password.
- Passwords are securely hashed using **bcryptjs** and stored in MongoDB.
- Sessions are managed using **express-session** with **connect-mongodb-session** for persistence.

### 🔄 Password Reset

- Users can request a **password reset** via email.
- A reset link is sent using **nodemailer** with **Mailtrap**.
- Users can set a new password after clicking the link.

### 🛍️ Product Management

- Users can **add, edit, and delete** their own products.
- Product images are uploaded using **multer**.
- All users can **view** products, but only owners can **modify** them.

### 🛒 Shopping Cart

- Users can **add products to their cart** and manage quantities.
- The cart is **persisted across sessions**.

### 💳 Checkout & Payments

- Secure payments are processed using **Stripe**.
- Users are redirected to the **Orders page** upon successful payment.

### 📦 Order Management

- Users can **view their orders** and **download invoices**.
- Invoices are generated as **PDFs using pdfkit**.

### 🔍 Form Validation & Security

- Forms are validated using **express-validator**.
- CSRF protection is implemented using **csurf**.
- Error messages are displayed using **connect-flash**.

### 📄 Pagination

- Products are listed with **pagination** for better user experience.

### 🛠️ Environment Management

- Sensitive credentials (MongoDB URL, Stripe keys, Mailtrap credentials) are stored in **.env** and accessed via **dotenv**.

### 🎨 Frontend Design

- Built with **EJS** template engine for dynamic views.
- Styled with **Bootstrap** for a responsive and modern UI.
- **Animate.css** for smooth animations.

## 🛠️ Technologies Used

| Category                   | Technologies                                       |
| -------------------------- | -------------------------------------------------- |
| **Backend**                | Node.js, Express.js                                |
| **Database**               | MongoDB (Mongoose for ODM)                         |
| **Authentication**         | bcryptjs, express-session, connect-mongodb-session |
| **File Upload**            | multer                                             |
| **Email Service**          | nodemailer (Mailtrap for testing)                  |
| **Payments**               | Stripe                                             |
| **PDF Generation**         | pdfkit                                             |
| **Form Validation**        | express-validator                                  |
| **Security**               | csurf (CSRF protection)                            |
| **Frontend**               | EJS, Bootstrap, Animate.css                        |
| **Environment Management** | dotenv                                             |

## 📌 Why This Project?

This project showcases a strong understanding of **full-stack development** with **Node.js**, including:

- ✅ User authentication and session management.
- ✅ Database integration with MongoDB.
- ✅ File handling and image uploads.
- ✅ Secure payment integration with Stripe.
- ✅ PDF generation for invoices.
- ✅ Form validation and error handling.
- ✅ Secure credential storage with environment variables.
- ✅ A responsive and animated frontend using Bootstrap and Animate.css.

It is a **complete e-commerce solution** that demonstrates skills in building **scalable, secure, and user-friendly** web applications.

## 📖 How to Use

1. **Clone the repository:**
   ```sh
   git clone https://github.com/darshan-trambadiya/node-online-store-with-mongo.git
   cd node-online-store-with-mongo
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up your `.env` file** with required credentials.
4. **Run the application:**
   ```sh
   npm start
   ```
5. **Access the app** in your browser and explore the features.

---

💡 **Contributions are welcome!** If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

🎯 **Happy Coding!** 🚀
