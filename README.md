

## 📧 Email Verification System 

### 📌 Project Description

This project includes a **user authentication system with email verification**.
When a user registers, a **verification email (OTP or verification link)** is sent to the user’s email address.
The account will be activated **only after successful email verification**, improving security and preventing fake accounts.

---

### 🚀 Features

* User Registration
* Email Verification (OTP / Verification Link)
* Secure Login System
* Password Encryption
* Resend Verification Email
* Email-based Account Activation
* REST API Support

---

### 🛠️ Technologies Used

**Frontend**

* React / HTML / CSS / Bootstrap (or Tailwind)
* Axios / Fetch API

**Backend**

* Node.js
* Express.js
* MongoDB
* Nodemailer

**Other**

* JWT Authentication
* bcrypt for password hashing

---

### 📂 Project Structure

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

### ⚙️ Environment Variables

Create a `.env` file in the backend folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret
```

---

### ▶️ How to Run the Project

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

---

### 📩 Email Verification Flow

1. User registers with email and password
2. System sends OTP / verification link to email
3. User enters OTP or clicks verification link
4. Account status changes to **Verified**
5. User can log in successfully

---

### 🔐 Security Features

* Password hashing using bcrypt
* JWT-based authentication
* Email verification before login
* Token expiration for OTP / links

---

### 📌 Future Improvements

* Forgot Password with Email OTP
* Two-Factor Authentication (2FA)
* Admin Panel
* Rate Limiting for OTP requests

---
