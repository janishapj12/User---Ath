
# 📧 Email Verification System

https://github.com/user-attachments/assets/be239497-81c1-47f2-a5f2-2a98898ef6b8

https://github.com/user-attachments/assets/dee9f2a0-5f94-415a-89fb-bad207c405cf

---

## 📌 Project Overview

Welcome to the **Email Verification System**! 🎉
This project is designed to provide a **secure user authentication experience**. Users must verify their email through an **OTP or verification link** before gaining full access.

This prevents fake accounts and ensures that your application maintains **trustworthy user interactions**.

---

## 🚀 Key Features

✨ **User Registration** – Sign up with email & password
✨ **Email Verification** – OTP or clickable verification link
✨ **Secure Login System** – Only verified accounts can log in
✨ **Password Encryption** – All passwords are hashed with bcrypt
✨ **Resend Verification Email** – Users can request a new OTP/link
✨ **Email-based Account Activation** – Automatic status update
✨ **REST API Ready** – Integrate easily with other systems

---

## 🛠️ Tech Stack

**Frontend:**

* React / HTML / CSS / Tailwind or Bootstrap
* Axios / Fetch API

**Backend:**

* Node.js + Express.js
* MongoDB for database
* Nodemailer for sending emails

**Security & Others:**

* JWT Authentication
* bcrypt for password hashing

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret
```

> Make sure your email supports **less secure app access** or use **App Passwords** for Gmail.

---

## ▶️ Running the Project

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

Your app should **auto-start** on `http://localhost:3000` and the backend on `http://localhost:5000`. 🎯

---

## 📩 How Email Verification Works

1. User registers with email & password
2. Server generates an OTP or unique verification link
3. OTP/link is sent via email
4. User enters OTP or clicks the link
5. Account is marked **Verified**
6. User can now log in successfully ✅

---

## 🔐 Security Highlights

* Passwords are **hashed** with bcrypt
* **JWT tokens** used for authentication
* Email verification **required before login**
* OTP/link **expires after a set time** for safety

---

## 📌 Future Upgrades

* Forgot Password with Email OTP
* Two-Factor Authentication (2FA)
* Admin Panel
* Rate Limiting / Brute Force Protection

-
