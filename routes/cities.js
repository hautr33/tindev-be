const express = require('express');
const router = express.Router();
const City = require('../models/City');
const verify = require('../utilities/verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *      City:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of city
 *                  example: 60be30327d1e161ce0ef4bc9
 *              name:
 *                  type: string
 *                  description: The city name
 *                  example: Bắc Giang
 */

/**
 * @swagger
 * tags:
 *  name: Cities
 *  description: Access to cities API
 */

/**
 * @swagger
 * /api/v1/cities:
 *  get:
 *      summary: Returns the list of all the cities
 *      tags: [Cities]
 *      responses:
 *          200:
 *              description: The list of the cities
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/City'
 */
router.get('/', async (req, res) => {
    const cities = await City.find().sort({ "name": 1 });
    res.send({ cities });
});

/**
 * @swagger
 * /api/v1/cities/search/{name}:
 *  get:
 *      summary: Search the cities by name
 *      tags: [Cities]
 *      parameters:
 *          -   in: path
 *              name: name
 *              schema:
 *                  type: string
 *              required: true
 *              description: The city name
 *      responses:
 *          200:
 *              description: The city detail by name
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/City'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The city was not found
 */
router.get('/search/:name', async (req, res) => {
    try {
        const city = await City.find({ name: { $regex: req.params.name } }).sort({ "name": 1 });
        if (city == null || city.length == 0) {
            res.status(404);
            res.send('The city was not found')
        } else {
            res.send({ city });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/cities/{id}:
 *  get:
 *      summary: Get the city by id
 *      tags: [Cities]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The city id
 *      responses:
 *          200:
 *              description: The city detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/City'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The city was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (city == null) {
            res.status(404);
            res.send('The city was not found')
        } else {
            res.send({ city });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});

module.exports = router;