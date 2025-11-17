const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const sequelize = require("./config/db");

const app = express();
const PORT = 3001;

// Configuration du moteur de templates Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MySQL
sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à MySQL réussie"))
  .catch((err) => console.error("❌ Erreur connexion MySQL :", err));

// Synchronisation du modèle
sequelize
  .sync({ alter: true })
  .then(() => console.log("🧱 Base de données synchronisée et tables créées si inexistantes"))
  .catch((err) => console.error("❌ Erreur de synchronisation :", err));

// Routes
app.get("/", (req, res) => res.redirect("/login"));

app.get("/register", (req, res) => res.render("register"));

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'inscription");
  }
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.send("Utilisateur non trouvé !");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.send("Mot de passe incorrect !");
  res.send(`Bienvenue ${user.name} !`);
});

// Lancer le serveur
app.listen(PORT, () =>
  console.log(`🚀 Serveur sur http://localhost:${PORT}`)
);
