require('dotenv').config();
const express = require("express");
const bcrypt = require('bcrypt');
const userSchema = require('../models/User');
const router = express.Router();
let mongoId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken'); // Import json web token
const passport = require("passport"); // Import Passport
const CLIENT_URL = 'http://localhost:3000/'

const app = express(); // Hold an instance of the express function
const cors = require("cors"); // Import CORS
app.use(cors({ origin: 'http://localhost:3000', credentials: true, methods: 'GET,PUT,POST,OPTIONS', allowedHeaders: 'Content-Type,Authorization,Access-Control-Allow-Credentials' }));
// Use CORS middleware

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        "msg": "Login failed!"
    })
})

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            "msg": "Logged in successfully!",
            "user": req.user
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${CLIENT_URL}login`);
})

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login/failed', successRedirect: CLIENT_URL }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.get('/github',
    passport.authenticate('github', { scope: ['profile'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login/failed', successRedirect: CLIENT_URL }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.get('/login', async (req, res) => {
    const user = req.query;
    let filter = { username: user.username };
    let result = await userSchema.find(filter);
    if (result.length) {
        try {
            let foundUser = result[0];
            if (await bcrypt.compare(user.password, foundUser.password)) {
                const accessToken = generateAccessToken(foundUser.toJSON());
                const refreshToken = jwt.sign(foundUser.toJSON(), process.env.REFRESH_TOKEN_SECRET)
                res.json({ accessToken, refreshToken, user: foundUser })
            } else {
                res.status(401).send({ "msg": "Invalid Credentials!" });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send();
        }
    } else if (result.length === 0) {
        res.status(400).send({ "msg": "User does not exist!" });
    } else {
        res.status(500).send();
    }
});

router.get('/getUsers', authenticateToken, async (req, res) => {
    userSchema.find({}, (err, users) => {
        if (!err) {
            try {
                res.send(users)
            } catch (error) {
                res.status(500).send();
            }
        } else {
            res.status(500).send();
        }
    });
})

router.post('/addUser', async (req, res) => {
    let user = req.body;
    let filter = { username: user.username };
    let result = await userSchema.find(filter);
    if (result.length) {
        res.status(400).send({ "msg": "User already exists!" });
    } else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            let newUser = new userSchema({
                ...user
            });
            newUser.save((err, doc) => {
                if (!err) {
                    res.send({ "msg": "User added successfully" })
                } else {
                    res.status(500).send();
                }
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
});

router.delete('/deleteUser/:id', (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: 'Not a valid Mongo ID' });
    } else {
        userSchema.findByIdAndDelete(req.params.id, async (err, doc) => {
            if (!err) {
                try {
                    res.send({ msg: 'User deleted successfully!' })
                } catch (error) {
                    res.status(500).send(error);
                }
            } else {
                res.status(400).send({ msg: 'Error deleting user!' });
            }
        })
    }
})

router.put('/editUser/:id', (req, res) => {
    if (!mongoId.isValid(req.params.id)) {
        res.status(400).send({ msg: 'Invalid Mongo ID' });
    } else {
        let updatedUser = { ...req.body };
        userSchema.findByIdAndUpdate(req.params.id, { $set: updatedUser }, { new: true }, (err, doc) => {
            if (!err) {
                res.send({ msg: 'User updated successfully' })
            } else {
                res.status(400).send({ msg: 'Error updating user' });
            }
        })
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}
module.exports = router;
