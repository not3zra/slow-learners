const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, registerNumber, programme } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
      // Below are role specific attributes [We can give an option to edit these later in user profiles]
      registerNumber: role === "student" ? registerNumber : undefined,
      programme: role === "student" ? programme : undefined,
      subjectsTeaching: role === "teacher" ? [] : undefined,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // We will be following session based authentication
    req.session.user = { id: user._id, role: user.role };
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
