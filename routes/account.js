const express = require('express');
const router = express.Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken')

router.get('/forgot-password/:token', async (req, res) => {
    try {
        const decoded = jwt.decode(req.params.token);
        const user = await User.findOne({ email: decoded.email });
        const verified = jwt.verify(req.params.token, process.env.TOKEN_SECRET + user._id + user.secret_key);
        if (verified) {
            res.render('reset_password', { token: req.params.token })
        }
    } catch (error) {
        if (error.message.includes('expired')) {
            res.redirect('http://localhost:3000/account/forgot-password-error')
        } else {
            res.status(500).send(error.message)
        }
    }
});

router.get('/forgot-password-error', async (req, res) => {
    res.render('not_found')
});

router.get('/reset-password-success', async (req, res) => {
    res.render('reset_password_success')
});
module.exports = router;