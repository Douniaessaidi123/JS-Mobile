const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tp2db", "root", "chaimaa2004", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // désactive les logs SQL si tu veux
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à MySQL réussie"))
  .catch((err) => console.error("❌ Impossible de se connecter à MySQL :", err));

module.exports = sequelize;
