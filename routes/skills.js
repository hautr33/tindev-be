const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

/**
 * @swagger
 * components:
 *  schemas:
 *      Skill:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of skill
 *                  example: 60bf0df7e11b854b208a4470
 * 
 *              name:
 *                  type: string
 *                  description: The skill name
 *                  example: JavaScript
 */

/**
 * @swagger
 * tags:
 *  name: Skills
 *  description: Access to skills API
 */

/**
 * @swagger
 * /api/v1/skills:
 *  get:
 *      summary: Returns the list of all the skills
 *      tags: [Skills]
 *      responses:
 *          200:
 *              description: The list of the skills
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Skill'
 *          400:
 *              description: Invalid input
 */
router.get('/', async (req, res) => {
    const skills = await Skill.find().sort({ "name": 1 });
    res.send({ skills });
});


/**
 * @swagger
 * /api/v1/skills/search/{name}:
 *  get:
 *      summary: Search the skills by name
 *      tags: [Skills]
 *      parameters:
 *          -   in: path
 *              name: name
 *              schema:
 *                  type: string
 *              required: true
 *              description: The skill name
 *      responses:
 *          200:
 *              description: The skill detail by name
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Skill'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The skill was not found
 */
router.get('/search/:name', async (req, res) => {
    try {
        const skill = await Skill.find({ name: { $regex: req.params.name } }).sort({ "name": 1 });
        if (skill == null || skill.length == 0) {
            res.status(404);
            res.send('The skill was not found')
        } else {
            res.send({ skill });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/skills/{id}:
 *  get:
 *      summary: Get the skill by id
 *      tags: [Skills]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The skill id
 *      responses:
 *          200:
 *              description: The skill detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Skill'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The skill was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (skill == null) {
            res.status(404);
            res.send('The skill was not found')
        } else {
            res.send({ skill });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});

module.exports = router;