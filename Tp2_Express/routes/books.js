const express = require("express");
const router = express.Router();

const books = [
  { title: "Clean Architecture", author: "Robert C. Martin" },
  { title: "Refactoring", author: "Martin Fowler" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke" },
];

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error_msg", "Veuillez vous connecter pour accéder à cette page");
  res.redirect("/login");
}

router.get("/", ensureAuth, (req, res) => {
  res.render("books", { user: req.user, books });
});

module.exports = router;
