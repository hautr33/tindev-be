const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const Developer = require('../models/Developer');
const Job_Requirement = require('../models/Job_Recruitment');
const Matching = require('../models/Matching');
const Photo = require('../models/Photo');

const PublitioAPI = require('publitio_js_sdk').default;
const API_KEY = process.env.PUBLIT_IO_API_KEY;
const API_SECRET = process.env.PUBLIT_IO_API_SECRET;
const publitio = new PublitioAPI(API_KEY, API_SECRET);

const verify = require('../utilities/verifyToken');
const { updateDeveloperValidation } = require('../utilities/validation');

/**
 * @swagger
 * components:
 *  schemas:
 *      Developer:
 *          type: object
 *          required:
 *              - full_name
 *              - email
 *              - birthday
 *              - phone
 *              - gender
 *              - city
 *              - job_expectation
 *              - skills
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of developer
 *                  example: 60bf0df7e11b854b208a4470
 *              full_name:
 *                  type: string
 *                  description: The developer full name
 *                  example: Tran Van A
 *              email:
 *                  type: string
 *                  description: The developer email
 *                  example: qkt123@gmail.com
 *              birthday:
 *                  type: string
 *                  description: The developer birthday
 *                  example: 1999-03-31
 *              phone:
 *                  type: string
 *                  description: The developer phone
 *                  example: 0123456789
 *              gender:
 *                  type: string
 *                  description: The developer gender
 *                  example: Male
 *              city:
 *                  type: string
 *                  description: The developer city
 *                  example: Bắc Giang
 *              facebook_url:
 *                  type: string
 *                  description: The company tax code
 *                  example: https://facebook.com/example
 *              linkedin_url:
 *                  type: string
 *                  description: The company tax code
 *                  example: https://www.linkedin.com/in/example
 *              twitter_url:
 *                  type: string
 *                  description: The company tax code
 *                  example: https://twitter.com/example
 *              description:
 *                  type: string
 *                  description: The developer description
 *                  example: I will design HTML, CSS, Bootstrap website
 *              job_expectation:
 *                  type: object
 *                  properties:
 *                      job_type:
 *                          type: string
 *                          description: The job type that developer want to apply
 *                          example: Java Developer
 *                      year_experience:
 *                          type: integer
 *                          description: The year experience of developer
 *                          example: 1
 *                      expected_salary:
 *                          type: integer
 *                          description: The salary of job that developer expected
 *                          example: 500
 *                      work_place:
 *                          type: string
 *                          description: The the work place of job
 *                          example: Ho Chi Minh
 *              skills:
 *                  type: array
 *                  items:
 *                      type: string
 *                      description: The skills of developer
 *                  example: 
 *                      - Java
 *                      - Android
 *                      - PHP
 *              user_id:
 *                  type: string
 *                  description: The developer user id
 *                  example: 60bf0df7e11b854b208a4470
 */

/**
 * @swagger
 * tags:
 *  name: Developers
 *  description: Access to developers API
 */



/**
 * @swagger
 * /api/v1/developers/my-info:
 *  get:
 *      summary: Get developer information
 *      tags: [Developers]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The developer information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Developer'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The developer was not found
 */
router.get('/my-info', verify, async (req, res) => {
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');
    try {
        const developer = await Developer.findOne({ user_id: req.user._id });
        if (developer == null) {
            res.status(404);
            res.send('The developer was not found')
        } else {
            const photo_url = await getPhotoUrl(developer.photo_id);
            developer.photo_url = photo_url;
            res.send({ developer });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/developers/my-info:
 *  put:
 *      summary: Update developer information
 *      tags: [Developers]
 *      security:
 *          - auth-token: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Developer'
 *      responses:
 *          200:
 *              description: The developer was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Developer'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The developer was not found
 *          500: 
 *              description: Some error happened
 */
router.put('/my-info', verify, async (req, res) => {
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');
    //Validate the data
    const { error } = updateDeveloperValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking phone
    const phone_exist = await Developer.findOne({ phone: req.body.phone, user_id: { $ne: req.user._id } });
    const phone_exist_2 = await Company.findOne({ phone: req.body.phone });
    console.log(phone_exist);
    console.log(phone_exist_2);
    if (phone_exist || phone_exist_2) return res.status(400).send('Phone number \'' + req.body.phone + '\' already exists!');

    const isExist = await Developer.findOne({ user_id: req.user._id });
    if (isExist) {
        try {
            var birthday = new Date(req.body.birthday);
            var date = birthday.getDate();
            if (date < 10) {
                date = "0" + date;
            }
            var month = birthday.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            var birthday_str = birthday.getFullYear() + "-" + month + "-" + date;
            var updated = await Developer.updateOne(
                { user_id: req.user._id },
                {
                    $set: {
                        full_name: req.body.full_name,
                        photo_id: req.body.photo_id,
                        birthday: birthday_str,
                        phone: req.body.phone,
                        gender: req.body.gender,
                        city: req.body.city,
                        facebook_url: req.body.facebook_url,
                        linkedin_url: req.body.linkedin_url,
                        twitter_url: req.body.twitter_url,
                        description: req.body.description,
                        job_expectation: req.body.job_expectation,
                        skills: req.body.skills,
                    }
                }
            );
            updated = await Developer.findOne({ user_id: req.user._id });
            res.send({ updated });

        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    } else {
        res.status(404).send("User ID was not found!!")
    }
});


/**
 * @swagger
 * /api/v1/developers/random:
 *  get:
 *      summary: Get developer randomly
 *      tags: [Developers]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: Return the developer
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Developer'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/random', verify, async (req, res) => {
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API');
    let random_by = [
        "salary",
        "job_type",
        "year_experience",
        "work_place"
    ]
    let is_not_success = true;
    var count = 0;
    while (is_not_success && count < 10) {
        const job = await Job_Requirement.aggregate([
            {
                $match: {
                    user_id: req.user._id,
                }
            },
            { $sample: { size: 1 } }]);
        if (job.length == 1) {
            var random_index = Math.floor(Math.random() * random_by.length);
            switch (random_index) {
                case 0: {
                    console.log("Random by " + random_by[random_index] + ": " + job[0].from_salary + "-" + job[0].to_salary);
                    const developer = await Developer.aggregate([
                        {
                            $match: {
                                "job_expectation.expected_salary": { $lte: job[0].to_salary },
                                "job_expectation.expected_salary": { $gte: job[0].from_salary }
                            }
                        },
                        { $sample: { size: 10 } }]);
                    if (developer.length >= 1) {
                        is_not_success = false;
                        const photo_url = await getPhotoUrl(developer[0].photo_id);
                        developer[0].photo_url = photo_url;
                        return res.send({ "developers": developer });
                    }
                    break;
                }
                case 1: {
                    console.log("Random by " + random_by[random_index] + ": " + job[0].job_type);
                    const developer = await Developer.aggregate([
                        { $match: { "job_expectation.job_type": job[0].job_type } },
                        { $sample: { size: 10 } }]);
                    if (developer.length >= 1) {
                        is_not_success = false;
                        const photo_url = await getPhotoUrl(developer[0].photo_id);
                        developer[0].photo_url = photo_url;
                        return res.send({ "developers": developer });
                    }
                    break;
                }
                case 2: {
                    console.log("Random by " + random_by[random_index] + ": " + job[0].year_experience);
                    const developer = await Developer.aggregate([
                        { $match: { "job_expectation.year_experience": { $gte: job[0].year_experience } } },
                        { $sample: { size: 10 } }]);
                    if (developer.length >= 1) {
                        is_not_success = false;
                        const photo_url = await getPhotoUrl(developer[0].photo_id);
                        developer[0].photo_url = photo_url;
                        return res.send({ "developers": developer });
                    }
                    break;
                }
                case 3: {
                    console.log("Random by " + random_by[random_index] + ": " + job[0].work_place);
                    const developer = await Developer.aggregate([
                        { $match: { "job_expectation.work_place": job[0].work_place } },
                        { $sample: { size: 10 } }]);
                    if (developer.length >= 1) {
                        is_not_success = false;
                        const photo_url = await getPhotoUrl(developer[0].photo_id);
                        developer[0].photo_url = photo_url;
                        return res.send({ "developers": developer });
                    }
                    break;
                }
            }
        }
        count++;
    }
    res.status(404).send("Not found!")
});


/**
 * @swagger
 * /api/v1/developers/like/{id}:
 *  post:
 *      summary: Like the developer with id
 *      tags: [Developers]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The developer id
 *      responses:
 *          200:
 *              description: Like successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          description: Like successfully
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The developer was not found
 */
router.post('/like/:id', verify, async (req, res) => {
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API');
    try {
        const developer = await Developer.findOne({ _id: req.params.id });
        const company = await Company.findOne({ user_id: req.user._id });
        if (developer) {
            if (company) {
                const isInteracted = await Matching.findOne({
                    company_user_id: company.user_id,
                    developer_user_id: developer.user_id,
                    job_recruitment_id: { $eq: null }
                });
                if (isInteracted) {
                    if (isInteracted.is_developer_like != null && isInteracted.is_company_like == null) {
                        await Matching.updateOne(
                            { _id: isInteracted._id },
                            {
                                $set: {
                                    is_company_like: true,
                                }
                            })
                        if (isInteracted.is_developer_like) {
                            return res.send("Matched!!!")
                        } else {
                            return res.send("Liked!!!")
                        }
                    } else {
                        return res.status(400).send("You have interacted to this developer!!!")
                    }
                } else {
                    const like = new Matching({
                        company_user_id: company.user_id,
                        developer_user_id: developer.user_id,
                        is_company_like: true,
                    });
                    await like.save();
                    return res.send("Liked!!!")
                }
            } else {
                res.status(404).send('The company was not found')
            }
        } else {
            res.status(404).send('The developer was not found')
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/developers/dislike/{id}:
 *  post:
 *      summary: Dislike the developer with id
 *      tags: [Developers]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The developer id
 *      responses:
 *          200:
 *              description: Dislike successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          description: Dislike successfully
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The developer was not found
 */
router.post('/dislike/:id', verify, async (req, res) => {
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API');
    try {
        const developer = await Developer.findOne({ _id: req.params.id });
        const company = await Company.findOne({ user_id: req.user._id });
        if (developer) {
            if (company) {
                const isInteracted = await Matching.findOne({
                    company_user_id: company.user_id,
                    developer_user_id: developer.user_id,
                    job_recruitment_id: { $eq: null }
                });
                if (isInteracted) {
                    if (isInteracted.is_developer_like != null && isInteracted.is_company_like == null) {
                        await Matching.updateOne(
                            { _id: isInteracted._id },
                            {
                                $set: {
                                    is_company_like: false,
                                }
                            })
                        if (isInteracted.is_developer_like) {
                            return res.send("Watch again!!!")
                        } else {
                            return res.send("Disliked!!!")
                        }
                    } else {
                        return res.status(400).send("You have interacted to this job recruitment!!!")
                    }
                } else {
                    const dislike = new Matching({
                        company_user_id: company.user_id,
                        developer_user_id: developer.user_id,
                        is_company_like: false,
                    });
                    await dislike.save();
                    return res.send("Disliked!!!")
                }
            } else {
                res.status(404).send('The company was not found')
            }
        } else {
            res.status(404).send('The developer was not found')
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/developers:
 *  get:
 *      summary: Returns the list of all the developers
 *      tags: [Developers]
 *      responses:
 *          200:
 *              description: The list of the developers
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Developer'
 *          400:
 *              description: Invalid input
 */
router.get('/', async (req, res) => {
    const developers = await Developer.find();
    res.send({ developers });
});


/**
 * @swagger
 * /api/v1/developers/user-id={id}:
 *  get:
 *      summary: Get the developer by user id
 *      tags: [Developers]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The developer user id
 *      responses:
 *          200:
 *              description: The developer detail by user id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Developer'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The developer was not found
 */
router.get('/user-id=:id', async (req, res) => {
    try {
        const developer = await Developer.findOne({ user_id: req.params.id });
        if (developer == null) {
            res.status(404);
            res.send('The developer was not found')
        } else {
            const photo_url = await getPhotoUrl(developer.photo_id);
            developer.photo_url = photo_url;
            res.send({ developer });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});




async function getPhotoUrl(id) {
    try {
        const photo = await Photo.findOne({ is_deleted: false, _id: id });
        await publitio.call(`/files/show/${photo.publit_io_id}`, 'GET')
            .then(data => {
                photo.url_preview = data.url_preview;
            })
            .catch(error => { console.log(error) })
        return photo.url_preview;
    } catch (error) {
        return getDefaultPhoto();
    }
}

async function getDefaultPhoto() {
    const photo = await Photo.findOne({ is_default: true });
    await publitio.call(`/files/show/${photo.publit_io_id}`, 'GET')
        .then(data => {
            photo.url_preview = data.url_preview;
        })
        .catch(error => { console.log(error) })
    return photo.url_preview;
}

module.exports = router;