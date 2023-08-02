const express = require('express');
const router = express.Router();
const Job_Type = require('../models/Job_Type');

/**
 * @swagger
 * components:
 *  schemas:
 *      Job Types:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of job type
 *                  example: 60bf023ee11b854b208a4449
 * 
 *              name:
 *                  type: string
 *                  description: The job type name
 *                  example: Game Developer
 */

/**
 * @swagger
 * tags:
 *  name: Job Types
 *  description: Access to job types API
 */

/**
 * @swagger
 * /api/v1/job-types:
 *  get:
 *      summary: Returns the list of all the job types
 *      tags: [Job Types]
 *      responses:
 *          200:
 *              description: The list of the job types
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Job Types'
 *          400:
 *              description: Invalid input
 */
router.get('/', async (req, res) => {
    const jobTypes = await Job_Type.find().sort({ "name": 1 });
    res.send({ jobTypes });
});


/**
 * @swagger
 * /api/v1/job-types/search/{name}:
 *  get:
 *      summary: Search the job types by name
 *      tags: [Job Types]
 *      parameters:
 *          -   in: path
 *              name: name
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job type name
 *      responses:
 *          200:
 *              description: The job type detail by name
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Job Types'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The job type was not found
 */
router.get('/search/:name', async (req, res) => {
    try {
        const jobType = await Job_Type.find({ name: { $regex: req.params.name } }).sort({ "name": 1 });
        if (jobType == null || jobType.length == 0) {
            res.status(404);
            res.send('The job type was not found')
        } else {
            res.send({ jobType });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/job-types/{id}:
 *  get:
 *      summary: Get the job type by id
 *      tags: [Job Types]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The job type id
 *      responses:
 *          200:
 *              description: The job type detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Job Types'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The job type was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const jobType = await Job_Type.findById(req.params.id);
        if (jobType == null) {
            res.status(404);
            res.send('The job type was not found')
        } else {
            res.send({ jobType });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});

module.exports = router;