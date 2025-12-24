import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import allData from "./routes/allData.js"
import companyRoutes from "./routes/companyRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import allapplicationRoutes from "./routes/allapplicationRoutes.js";
import ServiceRoutes from "./routes/serviceRoutes.js";


dotenv.config();
connectDB();

const app = express();


// app.use(cors({
//   origin: ["http://127.0.0.1:3003", "http://localhost:3000"],
//   methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));


const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3003",

  // 🔥 LIVE FRONTEND (Public website)
  "https://galhotragroup.com",
  "http://galhotragroup.com",

  // 🔥 LIVE ADMIN PANEL
  "https://galhotrservice.com",
  "http://galhotrservice.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ❌ REMOVE — NO need for .options wildcard
// app.options("*", cors());
// app.options("/*", cors());






app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alldata", allData)
app.use("/api/application", allapplicationRoutes);
app.use("/api/service", ServiceRoutes)
app.use("/api/company", companyRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});


// app.listen(process.env.PORT || 4000, () =>
//   console.log(`Server running on PORT ${process.env.PORT}`)
// );


const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on PORT ${PORT}`);
});
