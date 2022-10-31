const express = require("express"); // Import express into app
const cors = require("cors"); // Import CORS
const cookieSession = require("cookie-session"); // Import Cookie Session
require("./passport"); // Import Passport Setup
const passport = require("passport"); // Import Passport
const app = express(); // Hold an instance of the express function
const userController = require("./controllers/userController"); // import User Model
const leaveController = require("./controllers/leaveController"); // import Leave Request Model

const db = require("./db"); // Import Database Connection

let PORT = process.env.PORT || 5000; // Set port for app to listen on

app.use(cors({ origin: 'http://localhost:3000', credentials: true, methods: 'GET,PUT,POST,OPTIONS,DELETE', allowedHeaders: 'Content-Type,Authorization,Access-Control-Allow-Credentials' })); // Use CORS middleware

app.use(cookieSession({ name: "session", keys: ["melody"], maxAge: 24 * 60 * 60 * 100 })); // Use Cookie Session middleware

app.use(passport.initialize()); // Initialize passport

app.use(passport.session()); // Initialize passport session

app.use(express.json()); // Allow app to accept JSON

if (process.env.NODE_ENV === 'production') {
    // Serve any static files (Our frontend app)
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
 }
 
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)); // Listen on port for route changes

app.use("/api", userController); // Use routes in controller
app.use("/api", leaveController); // Use routes in controller

module.exports = app;