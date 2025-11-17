const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// ✅ Route racine
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/register", (req, res) => res.render("register"));

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !email || !password) errors.push({ msg: "Tous les champs sont requis" });
  if (password.length < 6) errors.push({ msg: "Le mot de passe doit contenir au moins 6 caractères" });

  const existing = await User.findOne({ where: { email } });
  if (existing) errors.push({ msg: "Cet email existe déjà" });

  if (errors.length > 0) return res.render("register", { errors, name, email });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });

  req.flash("success_msg", "Inscription réussie ! Connectez-vous.");
  res.redirect("/login");
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "Déconnexion réussie");
    res.redirect("/login");
  });
});

module.exports = router;
