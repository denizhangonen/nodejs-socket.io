const express = require("express");

const User = require("../models/user");
const authController = require("../controller/auth");
const isAuth = require("../middleware/is-auth");

const { body } = require("express-validator/check");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("User already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("name")
      .trim()
      .not()
      .isEmpty(),
    body("password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Common a password must be longer than this!")
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [
    body("status")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
);

module.exports = router;
