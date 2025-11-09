// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bookRoutes from "./routes/books.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/books", bookRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));
