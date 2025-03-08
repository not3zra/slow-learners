const express = require("express");
const User = require("../models/user.model");

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

const { body, validationResult, check } = require('express-validator');

router.post("/login",
  [ 
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  
  async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // We will be following session based authentication
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
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

router.delete("/delete/:id",
  [
    check('id').isMongoId().withMessage('Invalid id'),
  ],
   
  async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/teachers/:id/subjects",
  [
    check("id").isMongoId().withMessage("Invalid id")
  ],
  async (req, res) => {
    try {
      const subjects = await User.findById(req.params.id);
      res.status(200).json({ subjects: subjects });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);


module.exports = router;
