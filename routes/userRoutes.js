const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User.js");
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    } else {
      const newUser = new User({
        username,
        email: normalizedEmail,
        password,
      });
      await newUser.save();

      const userData = newUser.toObject();
      delete userData.password;

      return res.status(201).json({ message: "Registration successful" });
    }
  } catch (error) {
    res.status(500).json({ message: "Registration failed", userData });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }); //find user who's email currently being requested

    //If no user is found
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password." });
    } else {
      const isCorrectPassword = await user.isCorrectPassword(password); //ask user if pass is correct and save it
      //if password is incorrect
      if (!isCorrectPassword) {
        return res
          .status(400)
          .json({ message: "Incorrect email or password." });
      }
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
      );
      return res.status(200).json({
        token,
        user: { _id: user._id, username: user.username, email: user.email },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong on our server, Please try again!",
    });
  }
});

module.exports = router;
