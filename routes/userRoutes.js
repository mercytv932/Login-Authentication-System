const express = require("express");
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

module.exports = router;
