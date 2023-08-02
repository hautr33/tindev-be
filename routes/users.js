const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const Developer = require('../models/Developer');
const User = require('../models/User');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const { registerValidation, loginValidation, forgotPasswordValidation } = require('../utilities/validation');
const rand = require("random-key");

const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { token } = require('morgan');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(to, subject, html) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: '2s2svenus2s2s@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: {
                name: 'Tindev 📧 Team Chicken',
                address: 'support-tindev@team-chicken.com'
            },
            // from: 'Tindev 📧 Team Chicken <support-tindev@team-chicken.com>',
            to: to,
            subject: subject,
            html: html
        }
        const result = await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        return error
    }
}

function getActivateAccountMessage(url) {
    return '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">' +
        '<div class="container"><div style="background-color: rgba(114, 187, 216, 0.699); padding: 10px"><h1 style="text-align: center;color: white;" > Tindev - Team Chicken</h1><h2 style="text-align: center;color: white;">Activate Your Account</h2></div>' +
        '<div style="background-color: rgba(255, 255, 255, 0.699); padding-top: 10px; padding-bottom: 30px; padding-left: 30px; padding-right: 30px;color: rgba(0, 0, 0, 0.6);">' +
        '<p style="font-size: 16px; line-height: 22.4px;">Hello,</p><p style="font-size: 16px; line-height: 22.4px;">We have sent you this email in response to your request to register new account in our application.</p>' +
        '<p style="font-size: 16px; line-height: 22.4px;">To activate your account, please follow the link below: </p><p style="font-size: 16px; line-height: 22.4px;"><b><a style="color: rgba(114, 187, 216, 0.699);" href="' + url + '">Click here to activate your account</a></b></p>' +
        '<em><span style="font-size: 16px; line-height: 22.4px;">Please ignore this email if you did not register an account.</span></em>' +
        '</div><div style="background-color: rgba(114, 187, 216, 0.699); padding: 10px"><p style="text-align: center;color: white; font-size: 14px; line-height: 20px;">Team Chicken © All Rights Reserved</p></div></div>';
}

function getForgotPasswordMessage(url) {
    return '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">' +
        '<div class="container"><div style="background-color: rgba(114, 187, 216, 0.699); padding: 10px"><h1 style="text-align: center;color: white;">Tindev - Team Chicken</h1><h2 style="text-align: center;color: white;">Reset Password</h2></div>' +
        '<div style="background-color: rgba(255, 255, 255, 0.699); padding-top: 10px; padding-bottom: 30px; padding-left: 30px; padding-right: 30px;color: rgba(0, 0, 0, 0.6);"><p>Hello,</p><p>We have sent you this email in response to your request to reset your password.</p>' +
        '<p>To reset your password, please follow the link below in <b>5 minutes</b>: </p><p><b><a style="color: rgba(114, 187, 216, 0.699);" href="' + url + '">Click here to reset your password!</a></b></p><em><span style="font-size: 16px; line-height: 22.4px;">Please ignore this email if you did not reset your password.</span></em></div>' +
        '<div style="background-color: rgba(114, 187, 216, 0.699); padding: 10px"><p style="text-align: center;color: white;">Team Chicken © All Rights Reserved</p></div></div>';
}

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - email
 *              - password
 *              - role
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of user
 *                  example: 60bf0df7e11b854b208a4470
 *              email:
 *                  type: string
 *                  description: The email of user
 *                  example: qkt12345@gmail.com
 *              password:
 *                  type: string
 *                  description: The password of user
 *                  example: nhapPasswordNe
 *              role:
 *                  type: string
 *                  description: The password of user
 *                  example: Developer
 */


/**
 * @swagger
 * components:
 *  securitySchemes:
 *      auth-token:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * security:
 *  - auth-token: []
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UnauthorizedError:
 *          description: Access token is missing or invalid
 */


/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Access to users API
 */

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *      summary: Login by Tindev account
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              description: Email of user
 *                              type: string
 *                              example: qkt12345@gmail.com
 *                          password:
 *                              description: Password of user
 *                              type: string
 *                              example: nhapPasswordNe
 *      responses:
 *          200:
 *              description: Login successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          description: The authentication token
 *          400:
 *              description: Invalid input
 */

router.post('/login', async (req, res) => {
    //Validate the data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    //Checking if user unactive
    if (user.status != 'Active') return res.status(400).send('Unactive user');

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invald password")

    //Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET + user.secret_key);
    res.header('authorization', 'Bearer ' + token).send(token);
});


/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *      summary: Register new user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                          - role
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: The email of user
 *                              example: qkt12345@gmail.com
 *                          password:
 *                              type: string
 *                              description: The password of user
 *                              example: nhapPasswordNe
 *                          role:
 *                              type: string
 *                              description: The password of user
 *                              example: Developer
 *                          developer:
 *                              type: object
 *                              required:
 *                                  - full_name
 *                                  - birthday
 *                                  - phone
 *                                  - gender
 *                                  - city
 *                                  - address
 *                                  - job_expectation
 *                                  - skills
 *                              properties:
 *                                  full_name:
 *                                      type: string
 *                                      description: The developer full name
 *                                      example: Tran Van A
 *                                  birthday:
 *                                      type: string
 *                                      description: The developer birthday
 *                                      example: 1999-03-31
 *                                  phone:
 *                                      type: string
 *                                      description: The developer phone
 *                                      example: '0123456789'
 *                                  gender:
 *                                      type: string
 *                                      description: The developer gender
 *                                      example: Male
 *                                  city:
 *                                      type: string
 *                                      description: The developer city
 *                                      example: Bắc Giang
 *                                  description:
 *                                      type: string
 *                                      description: The developer description
 *                                      example: I will design HTML, CSS, Bootstrap website
 *                                  job_expectation:
 *                                      type: object
 *                                      properties:
 *                                          job_type:
 *                                              type: string
 *                                              description: The job type that developer want to apply
 *                                              example: Web Developer
 *                                          year_experience:
 *                                              type: integer
 *                                              description: The year experience of developer
 *                                              example: 1
 *                                          expected_salary:
 *                                              type: integer
 *                                              description: The salary of job that developer expected
 *                                              example: 500
 *                                          work_place:
 *                                              type: string
 *                                              description: The the work place of job
 *                                              example: Ho Chi Minh
 *                                  skills:
 *                                      type: array
 *                                      example: 
 *                                          - Java
 *                                          - Android
 *                                          - PHP
 *                          company:
 *                              type: object
 *                              required:
 *                                  - name
 *                                  - phone
 *                                  - city
 *                                  - tax_code
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                      description: The company name
 *                                      example: ABC Company
 *                                  phone:
 *                                      type: string
 *                                      description: The company phone
 *                                      example: '0123456789'
 *                                  city:
 *                                      type: string
 *                                      description: The company city
 *                                      example: Bắc Giang
 *                                  tax_code:
 *                                      type: string
 *                                      description: The company tax code
 *                                      example: 1234567890
 *                                  description:
 *                                      type: string
 *                                      description: The company description
 *                                      example: ABC is designing the future of hyperscale cloud and edge computing with the world’s first cloud native processor. Built for the cloud with a modern 64-bit Arm server-based architecture, ABC gives customers the freedom to accelerate the delivery of all cloud computing applications. With industry-leading cloud performance, power efficiency and scalability, ABC processors are tailored for the continued growth of cloud and edge computing.
 *      responses:
 *          200:
 *              description: Register successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          description: Register successfully
 *          400:
 *              description: Invalid input
 */


router.post('/register', async (req, res) => {
    //Validate the data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const email_exist = await User.findOne({ email: req.body.email });
    if (email_exist) return res.status(400).send('Email \'' + req.body.email + '\' already exists!');

    //Checking phone
    if (req.body.role == 'Developer') {
        if (req.body.developer == null) return res.status(400).send("Developer is required!");
        const phone_exist = await Developer.findOne({ phone: req.body.developer.phone });
        const phone_exist_2 = await Company.findOne({ phone: req.body.developer.phone });
        if (phone_exist || phone_exist_2) return res.status(400).send('Phone number \'' + req.body.developer.phone + '\' already exists!');
    } else {
        if (req.body.company == null) return res.status(400).send("Company is required!");
        const phone_exist = await Developer.findOne({ phone: req.body.company.phone });
        const phone_exist_2 = await Company.findOne({ phone: req.body.company.phone });
        if (phone_exist || phone_exist_2) return res.status(400).send('Phone number \'' + req.body.company.phone + '\' already exists!');
    }

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    var created_date = new Date(Date.now());
    var date = created_date.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var month = created_date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var created_date_str = created_date.getFullYear() + "-" + month + "-" + date;


    const user = new User({
        email: req.body.email,
        password: hash_password,
        role: req.body.role,
        secret_key: rand.generate(),
        created_date: created_date_str,
        status: "Active",
    });
    const saved_user = await user.save();
    try {
        if (req.body.role == 'Developer') {
            var birthday = new Date(req.body.developer.birthday);
            var date = birthday.getDate();
            if (date < 10) {
                date = "0" + date;
            }
            var month = birthday.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var birthday_str = birthday.getFullYear() + "-" + month + "-" + date;

            const dev = new Developer({
                email: req.body.email,
                photo_id: req.body.developer.photo_id,
                full_name: req.body.developer.full_name,
                birthday: birthday_str,
                phone: req.body.developer.phone,
                gender: req.body.developer.gender,
                city: req.body.developer.city,
                facebook_url: req.body.developer.facebook_url,
                linkedin_url: req.body.developer.linkedin_url,
                twitter_url: req.body.developer.twitter_url,
                description: req.body.developer.description,
                job_expectation: req.body.developer.job_expectation,
                skills: req.body.developer.skills,
                user_id: saved_user._id,
            });
            await dev.save();
        } else {
            const com = new Company({
                email: req.body.email,
                name: req.body.company.name,
                photo_id: req.body.company.photo_id,
                phone: req.body.company.phone,
                city: req.body.company.city,
                tax_code: req.body.company.tax_code,
                facebook_url: req.body.company.facebook_url,
                linkedin_url: req.body.company.linkedin_url,
                twitter_url: req.body.company.twitter_url,
                description: req.body.company.description,
                user_id: saved_user._id,
            });
            await com.save();
        }
        res.send("Register successfully!");
    } catch (error) {
        await User.deleteOne({ email: req.body.email });
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/user/forgot-password/{email}:
 *  post:
 *      summary: Login by Tindev account
 *      tags: [Users]
 *      parameters:
 *          -   in: path
 *              name: email
 *              schema:
 *                  type: string
 *              required: true
 *              description: The email
 *      responses:
 *          200:
 *              description: Login successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          description: The authentication token
 *          400:
 *              description: Invalid input
 */

router.post('/forgot-password/:email', async (req, res) => {
    //Validate the data
    const { error } = forgotPasswordValidation(req.params);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.params.email });
    if (user) {
        //Create and assign a token
        const token = jwt.sign({ email: req.params.email }, process.env.TOKEN_SECRET + user._id + user.secret_key, { expiresIn: '5m' });
        var message = getForgotPasswordMessage('http://localhost:3000/account/forgot-password/' + token);
        sendMail(req.params.email, "[Tindev] - Recover Password", message).then((result) => res.send("We have sent an email for you. Please checking your email!"))
            .catch((error) => res.status(500).send(error.message));
    } else {
        res.status(400).send("Invalid email")
    }

});


router.post('/update-password/:token', async (req, res) => {
    try {
        const decoded = jwt.decode(req.params.token);
        const user = await User.findOne({ email: decoded.email });
        const verified = jwt.verify(req.params.token, process.env.TOKEN_SECRET + user._id + user.secret_key);
        if (verified) {
            if (req.body.password != req.body.confirm_password) {
                res.status(400).send('Password and Confirm Password was not matched!')
            } else {
                //Hash passwords
                const salt = await bcrypt.genSalt(10);
                const hash_password = await bcrypt.hash(req.body.password, salt);
                await User.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: hash_password,
                        }
                    }
                );
                res.redirect('http://localhost:3000/account/reset-password-success')
            }
        }
    } catch (error) {
        if (error.message.includes('expired')) {
            res.redirect('http://localhost:3000/account/forgot-password-error')
        } else {
            res.status(500).send(error.message)
        }
    }

});


module.exports = router;