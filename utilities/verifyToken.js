const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('authorization');
    if (!token) return res.status(401).send('Access Denied!');

    try {
        const decoded = jwt.decode(token.split(' ')[token.split(' ').length - 1]);
        const user = await User.findOne({ _id: decoded._id });
        const verified = jwt.verify(token.split(' ')[token.split(' ').length - 1], process.env.TOKEN_SECRET + user.secret_key);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}