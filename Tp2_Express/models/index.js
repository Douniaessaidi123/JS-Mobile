const sequelize = require("../config/db");
const User = require("./User");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion MySQL réussie depuis models/index.js");
    await sequelize.sync({ alter: true });
    console.log("🧱 Tables synchronisées");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
  }
})();

module.exports = { sequelize, User };

