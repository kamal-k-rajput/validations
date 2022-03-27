const express = require("express");

const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/user.models");
router.get("/", async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    res.status(200).send({ user: user });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post(
  "/",
  body("first_name")
    .isLength({ min: 3 })
    .withMessage("first name is required and must be at least 3 characters"),
  body("last_name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters"),
  body("email")
    .isEmail()
    .withMessage("email address must be a valid email address"),
  body("pincode")
    .isLength({ min: 6, max: 6 })
    .withMessage("pincode must be at least 6 characters"),
  body("age")
    .isNumeric()
    .withMessage("age must be a number")
    .custom((value) => {
      if (value < 1 && value > 120) {
        throw new Error("age is in the valid range");
      }
      return true;
    }),
  body("gender").isEmpty().withMessage("gender must not be empty"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log({ errors });
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const user = await User.create(req.body);
      res.status(200).send({ user: user });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

module.exports = router;
