const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'gaurav';
const route = express.Router();
const authenticate = require('../middlewares/authenticateUser')


// ROUTE 1: Create a User using: POST "/createuser". 
route.post("/createuser", async (req, res) => {

    let success = false;

    // check to find if user already exist or not
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).send({ success, error: 'Email Id already exists' })
    }

    //  converting password into hash
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // creating a new user
    user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: secPass
    })
    let result = await user.save();

    const data = {
        user: {
            id: user._id.toString(),
            fullname: user.fullname
        }
    }

    success = true
    const token = jwt.sign(data, secret);
    res.send({ success, token })
})

// ROUTE 2: Authenticate a User using: POST "/login".
route.post('/login', async (req, res) => {

    let success = false;

    // check to find if user already exist or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ error: 'Please try to login with correct credentials' })
    }

    // check to find if password is correct or not
    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    if (!comparePassword) {
        return res.status(400).send({ success, error: 'Please try to login with correct credentials' })
    }

    const data = {
        user: {
            id: user._id.toString(),
            fullname: user.fullname
        }
    }

    success = true;

    const token = jwt.sign(data, secret);
    res.send({ success, token })


})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
route.get('/getuser', authenticate, async (req, res) => {

    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password');
        res.send(user);
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' })
    }
})



module.exports = route;