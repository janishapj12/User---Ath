import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectdb from "./config/mongodb.js";
import routes from "./routes/user.js";


const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectdb();

// CORS Configuration
const allowedOrigins = ['http://localhost:5173']; 
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Middleware
app.use(express.json());  // ✅ Ensures JSON parsing works
app.use(cookieParser());

app.get("/", (req, res) => res.send("Server is running 🚀"));
// User Routes
app.use("/api/user", routes)

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


