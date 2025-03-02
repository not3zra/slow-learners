const express = require("express");
const session = require("express-session");
const connectDB = require("./src/config/db");

const authenticateUser = require('./src/middlewares/authMiddleware')

// Routes
const userRoutes = require("./src/routes/user.routes");
const classroomRoutes = require("./src/routes/classroom.routes");

const app = express();
connectDB();

app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ----------------------API ROUTES------------------------------

/* 
    /api/users/signup
    /api/users/login
    /api/users/logout
    /api/users/delete
*/
app.use("/api/users", userRoutes);

// Protected routes (Must be logged in to access)
app.use(authenticateUser); // Middleware for authenticating the user before accessing the below routes

/* 
    /api/classrooms/list
    /api/classrooms/add
    /api/classrooms/delete
*/
app.use("/api/classrooms", classroomRoutes);



app.listen(5000, () => console.log(`Backend is running on port 5000`));
