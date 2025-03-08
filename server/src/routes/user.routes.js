const express = require("express");
const { logOut, logIn, deleteUser, signUp, getSubjects } = require("../controllers/user.controller");
const { validateLogIn, validateDeleteUser, validateSignUp, validateGetSubjects} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/signup", validateSignUp, signUp);

router.post("/login", validateLogIn, logIn);

router.post("/logout", logOut);

router.delete("/delete", validateDeleteUser,deleteUser);

//TODO: Optimize remaining routes

router.get("/teachers/:id/subjects", validateGetSubjects, getSubjects);


module.exports = router;
