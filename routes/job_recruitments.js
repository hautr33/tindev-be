const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const Developer = require('../models/Developer');
const Job_Recruitment = require('../models/Job_Recruitment');
const Matching = require('../models/Matching');

const verify = require('../utilities/verifyToken');
const { createJobRecruitmentValidation, updateJobRecruitmentValidation } = require('../utilities/validation');

/**
 * @swagger
 * components:
 *  schemas:
 *      Job Recruitment:
 *          type: object
 *          required:
 *              - title
 *              - work_place
 *              - expiried_date
 *              - work_place
 *              - from_salary
 *              - to_salary
 *              - job_type
 *              - skills
 *              - year_experience
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of job recruitment
 *                  example: 60bf0df7e11b854b208a4470
 *              user_id:
 *                  type: string
 *                  description: The auto-generated id of company
 *                  example: 60bf0df7e11b854b208a4470
 *              title:
 *                  type: string
 *                  description: The job recruitment name
 *                  example: Design a website
 *              work_place:
 *                  type: string
 *                  description: The job recruitment work place
 *                  example: Hồ Chí Minh
 *              expiried_date:
 *                  type: string
 *                  description: The date that job requirent expiried
 *                  example: 2021-08-31
 *              from_salary:
 *                  type: integer
 *                  description: The minimum of salary
 *                  example: 300
 *              to_salary:
 *                  type: integer
 *                  description: The maximum of salary
 *                  example: 500
 *              job_type:
 *                  type: string
 *                  description: The job recruitment skill type
 *                  example: Web Developer
 *              skills:
 *                  type: array
 *                  example: 
 *                      - Java
 *                      - Angular
 *                      - PHP
 *              year_experience:
 *                  type: integer
 *                  description: The year experience required
 *                  example: 1
 *              description:
 *                  type: string
 *                  description: The job recruitment description
 *                  example: Thực hiện việc tiếp nhận, hướng dẫn và giải quyết các yêu cầu / phản ánh / khiếu nại của khách hàng liên quan đến từng sản phẩm / dịch vụ cá nhân qua điện thoại/email/website theo định hướng chiến lược chung của ngân hàng.
 *              created_date:
 *                  type: string
 *                  description: The created date of job recruitment
 *                  example: 2021-07-13
 *              status:
 *                  type: string
 *                  description: The status of job recruitment
 *                  example: Active
 *              
 */

/**
 * @swagger
 * tags:
 *  name: Job Recruitments
 *  description: Access to job recruitments API
 */

/**
 * @swagger
 * /api/v1/job-recruitments:
 *  get:
 *      summary: Returns all job recruitments of company
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The list of job recruitments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Job Recruitment'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API!');

    const job_recruitments = await Job_Recruitment.find({ user_id: req.user._id });
    res.send({ "job_recruitments": job_recruitments });
});


/**
 * @swagger
 * /api/v1/job-recruitments:
 *  post:
 *      summary: Create new job recruitment of company
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Job Recruitment'
 *      responses:
 *          200:
 *              description: The job recruitment was successfully create
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Job Recruitment'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Some error happened
 */
router.post('/', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API!');

    //Validate the data
    const { error } = createJobRecruitmentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

    var expiried_date = new Date(req.body.expiried_date);
    var date = expiried_date.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var month = expiried_date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var expiried_date_str = expiried_date.getFullYear() + "-" + month + "-" + date;

    const jobRecruitment = new Job_Recruitment({
        title: req.body.title,
        work_place: req.body.work_place,
        expiried_date: expiried_date_str,
        from_salary: req.body.from_salary,
        to_salary: req.body.to_salary,
        job_type: req.body.job_type,
        skills: req.body.skills,
        year_experience: req.body.year_experience,
        description: req.body.description,
        created_date: created_date_str,
        user_id: req.user._id,
    });
    try {
        const savedCity = await jobRecruitment.save();
        res.send(savedCity);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.send({ error });
    }
});






/**
 * @swagger
 * /api/v1/job-recruitments/random:
 *  get:
 *      summary: Get job recruitment randomly
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: Return the job recruitment
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Job Recruitment'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/random', verify, async (req, res) => {
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');
    const developer = await Developer.findOne({ user_id: req.user._id });
    let random_by = [
        "expected_salary",
        "job_type",
        "year_experience",
        "work_place"
    ]
    var count = 0;
    let is_not_success = true;
    while (is_not_success && count < 10) {
        var random_index = Math.floor(Math.random() * random_by.length);
        switch (random_index) {
            case 0: {
                console.log("Random by " + random_by[random_index] + ": " + developer.job_expectation.expected_salary);
                const job_recruitment = await Job_Recruitment.aggregate([
                    {
                        $match: {
                            from_salary: { $lte: developer.job_expectation.expected_salary },
                            to_salary: { $gte: developer.job_expectation.expected_salary }
                        }
                    },
                    { $sample: { size: 10 } }]);
                if (job_recruitment.length >= 1) {
                    is_not_success = false;
                    const company = await Company.findOne({ user_id: job_recruitment[0].user_id })
                    return res.send({ "job_recruitments": job_recruitment });
                }
                break;
            }
            case 1: {
                console.log("Random by " + random_by[random_index] + ": " + developer.job_expectation.job_type);
                const job_recruitment = await Job_Recruitment.aggregate([
                    { $match: { job_type: developer.job_expectation.job_type } },
                    { $sample: { size: 10 } }]);
                if (job_recruitment.length >= 1) {
                    is_not_success = false;
                    const company = await Company.findOne({ user_id: job_recruitment[0].user_id })
                    return res.send({ "job_recruitments": job_recruitment });
                }
                break;
            }
            case 2: {
                console.log("Random by " + random_by[random_index] + ": " + developer.job_expectation.year_experience);
                const job_recruitment = await Job_Recruitment.aggregate([
                    { $match: { year_experience: { $gte: developer.job_expectation.year_experience } } },
                    { $sample: { size: 10 } }]);
                if (job_recruitment.length >= 1) {
                    is_not_success = false;
                    const company = await Company.findOne({ user_id: job_recruitment[0].user_id })
                    return res.send({ "job_recruitments": job_recruitment });
                }
                break;
            }
            case 3: {
                console.log("Random by " + random_by[random_index] + ": " + developer.job_expectation.work_place);
                const job_recruitment = await Job_Recruitment.aggregate([
                    { $match: { work_place: developer.job_expectation.work_place } },
                    { $sample: { size: 10 } }]);
                if (job_recruitment.length >= 1) {
                    is_not_success = false;
                    const company = await Company.findOne({ user_id: job_recruitment[0].user_id })
                    return res.send({ "job_recruitments": job_recruitment });
                }
                break;
            }
        }
        count++;
    }
    res.status(404).send("Not found!!")
});


/**
 * @swagger
 * /api/v1/job-recruitments/like/{id}:
 *  post:
 *      summary: Like the job recruitments with id
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job recruitments id
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
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');
    try {
        const developer = await Developer.findOne({ user_id: req.user._id });
        const job = await Job_Recruitment.findOne({ _id: req.params.id });
        const company = await Company.findOne({ user_id: job.user_id });
        if (developer) {
            if (job) {
                if (company) {
                    const isInteracted = await Matching.findOne({
                        company_user_id: company.user_id,
                        developer_user_id: developer.user_id,
                        job_recruitment_id: job._id
                    });
                    if (isInteracted) {
                        if (isInteracted.is_company_like != null) {
                            await Matching.updateOne(
                                { _id: isInteracted._id },
                                {
                                    $set: {
                                        is_developer_like: true,
                                    }
                                })
                            if (isInteracted.is_company_like) {
                                return res.send("Matched!!!")
                            } else {
                                return res.send("Liked!!!")
                            }
                        } else {
                            return res.status(400).send("You have interacted to this job recruitment!!!")
                        }
                    } else {
                        const isInteracted = await Matching.findOne({
                            company_user_id: company.user_id,
                            developer_user_id: developer.user_id,
                            job_recruitment_id: { $eq: null }
                        });
                        if (isInteracted) {
                            if (isInteracted.is_company_like != null && isInteracted.is_developer_like == null) {
                                await Matching.updateOne(
                                    { _id: isInteracted._id },
                                    {
                                        $set: {
                                            is_developer_like: true,
                                            job_recruitment_id: job._id
                                        }
                                    })
                                if (isInteracted.is_company_like) {
                                    return res.send("Matched!!!")
                                } else {
                                    return res.send("Liked!!!")
                                }
                            } else {
                                return res.status(400).send("You have interacted to this job recruitment!!!")
                            }
                        } else {
                            const like = new Matching({
                                company_user_id: company.user_id,
                                developer_user_id: developer.user_id,
                                is_developer_like: true,
                                job_recruitment_id: job._id
                            });
                            await like.save();
                            return res.send("Liked!!!")
                        }
                    }
                } else {
                    res.status(404).send('The company was not found')
                }
            } else {
                res.status(404).send('The job recruitment was not found')
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
 * /api/v1/job-recruitments/dislike/{id}:
 *  post:
 *      summary: Dislike the job recruitments with id
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job recruitments id
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
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');
    try {
        const developer = await Developer.findOne({ user_id: req.user._id });
        const job = await Job_Recruitment.findOne({ _id: req.params.id });
        if (developer) {
            if (job) {
                const company = await Company.findOne({ user_id: job.user_id });
                if (company) {
                    const isInteracted = await Matching.findOne({
                        company_user_id: company.user_id,
                        developer_user_id: developer.user_id,
                        job_recruitment_id: job._id
                    });
                    if (isInteracted) {
                        if (isInteracted.is_company_like != null && isInteracted.is_developer_like == null) {
                            await Matching.updateOne(
                                { _id: isInteracted._id },
                                {
                                    $set: {
                                        is_developer_like: false,
                                    }
                                })
                            if (isInteracted.is_company_like) {
                                return res.send("Watch again!!!")
                            } else {
                                return res.send("Disliked!!!")
                            }
                        } else {
                            return res.status(400).send("You have interacted to this job recruitment!!!")
                        }
                    } else {
                        const isInteracted = await Matching.findOne({
                            company_user_id: company.user_id,
                            developer_user_id: developer.user_id,
                            job_recruitment_id: { $eq: null }
                        });
                        if (isInteracted) {
                            if (isInteracted.is_company_like != null) {
                                await Matching.updateOne(
                                    { _id: isInteracted._id },
                                    {
                                        $set: {
                                            is_developer_like: false,
                                            job_recruitment_id: job._id
                                        }
                                    })
                                if (isInteracted.is_company_like) {
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
                                is_developer_like: false,
                                job_recruitment_id: job._id
                            });
                            await dislike.save();
                            return res.send("Disliked!!!")
                        }
                    }
                } else {
                    res.status(404).send('The company was not found')
                }
            } else {
                res.status(404).send('The job recruitment was not found')
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
 * /api/v1/job-recruitments/{id}:
 *  get:
 *      summary: Get the job recruitment by id
 *      tags: [Job Recruitments]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job recruitment id
 *      responses:
 *          200:
 *              description: The job recruitment detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Job Recruitment'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The job recruitment was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const jobRecruitment = await Job_Recruitment.findById(req.params.id);
        if (jobRecruitment == null) {
            res.status(404);
            res.send({ message: 'The job recruitment was not found' })
        } else {
            res.send({ job_recruitment: jobRecruitment });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/job-recruitments/{id}:
 *  put:
 *      summary: Update the job recruitment by id
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job recruitment id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Job Recruitment'
 *      responses:
 *          200:
 *              description: The job recruitment was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Job Recruitment'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The job recruitment was not found
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500: 
 *              description: Some error happened
 */
router.put('/:id', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API!');

    //Check job
    const job = await Job_Recruitment.findOne({ _id: req.params.id });
    if (job == null || job.user_id != req.user._id) return res.status(400).send("Company do not have this job recruitment!");

    //Validate the data
    const { error } = updateJobRecruitmentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        var expiried_date = new Date(req.body.expiried_date);
        var date = expiried_date.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        var month = expiried_date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var expiried_date_str = expiried_date.getFullYear() + "-" + month + "-" + date;

        var updated = await Job_Recruitment.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    work_place: req.body.work_place,
                    expiried_date: expiried_date_str,
                    from_salary: req.body.from_salary,
                    to_salary: req.body.to_salary,
                    job_type: req.body.job_type,
                    skills: req.body.skills,
                    year_experience: req.body.year_experience,
                    description: req.body.description,
                }
            }
        );
        updated = await Job_Recruitment.findById(req.params.id);
        res.send({ updated });

    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/job-recruitments/{id}:
 *  delete:
 *      summary: Remove the job recruitment by id
 *      tags: [Job Recruitments]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job recruitment id
 *      responses:
 *          200:
 *              description: The job recruitment was removed
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The job recruitment was not found
 */
router.delete('/:id', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied: Only Company can access this API!');

    //Check job
    const job = await Job_Recruitment.findOne({ _id: req.params.id, status: "Active" });
    if (job == null || job.user_id != req.user._id) return res.status(400).send("Company do not have this job recruitment!");

    try {
        const removed = await Job_Recruitment.updateOne(
            { _id: req.params.id }, {
            $set: {
                status: "Deleted"
            }
        });
        if (removed == null) {
            res.status(404);
            res.send({ message: 'The job recruitment was not found' })
        } else {
            res.send("This job recruitment has been deleted successfully");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;