import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import helmet from 'helmet';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(helmet());

// CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],  // Allow resources from the same origin
      scriptSrc: ["'self'", "'unsafe-inline'"],  // Allow inline scripts (you can restrict this if possible)
      styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles
      fontSrc: ["'self'", "https://fonts.gstatic.com"],  // Allow fonts from Google Fonts
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],  // Allow images from your domain and data URIs
      connectSrc: ["'self'"],  // Allow AJAX/fetch connections from your domain
      frameAncestors: ["'none'"],  // Prevent embedding in iframes
    },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data: https://fonts.googleapis.com; img-src 'self' data: https://images.com; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
  );
  next();
});


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});