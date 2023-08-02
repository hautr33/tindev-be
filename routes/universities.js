const express = require('express');
const router = express.Router();
const University = require('../models/University');

/**
 * @swagger
 * components:
 *  schemas:
 *      University:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of university
 *                  example: 60befbede11b854b208a4397
 * 
 *              name:
 *                  type: string
 *                  description: The university name
 *                  example: Trường Đại học FPT
 */

/**
 * @swagger
 * tags:
 *  name: Universities
 *  description: Access to universities API
 */

/**
 * @swagger
 * /api/v1/universities:
 *  get:
 *      summary: Returns the list of all the universities
 *      tags: [Universities]
 *      responses:
 *          200:
 *              description: The list of the universities
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/University'
 *          400:
 *              description: Invalid input
 */
router.get('/', async (req, res) => {
    const universities = await University.find().sort({ "name": 1 });
    res.send({ universities });
});


/**
 * @swagger
 * /api/v1/universities/search/{name}:
 *  get:
 *      summary: Search the universities by name
 *      tags: [Universities]
 *      parameters:
 *          -   in: path
 *              name: name
 *              schema:
 *                  type: string
 *              required: true
 *              description: The university name
 *      responses:
 *          200:
 *              description: The university detail by name
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/University'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The university was not found
 */
router.get('/search/:name', async (req, res) => {
    try {
        const university = await University.find({ name: { $regex: req.params.name } }).sort({ "name": 1 });
        if (university == null || university.length == 0) {
            res.status(404);
            res.send('The university was not found')
        } else {
            res.send({ university });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/universities/{id}:
 *  get:
 *      summary: Get the university by id
 *      tags: [Universities]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The university id
 *      responses:
 *          200:
 *              description: The university detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/University'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The university was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (university == null) {
            res.status(404).send('The university was not found')
        } else {
            res.send({ university });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;