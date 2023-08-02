const express = require('express');
const router = express.Router();

const Education = require('../models/Education');
const User = require('../models/User');

const { createEducationValidation } = require('../utilities/validation');
const verify = require('../utilities/verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *      Education:
 *          type: object
 *          required:
 *              - school_name
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id
 *                  example: 60bf0df7e11b854b208a4470
 *              school_name:
 *                  type: string
 *                  description: The school name
 *                  example: Trường Đại học FPT
 *              from_year:
 *                  type: integer
 *                  description: Study form year
 *                  example: 2017
 *              to_year:
 *                  type: integer
 *                  description: Study to year
 *                  example: 2021
 *              is_studying:
 *                  type: boolean
 *                  description: Is studying in school?
 *                  example: true
 *              majors:
 *                  type: string
 *                  description: The majors
 *                  example: Kỹ Thuật Phần Mềm
 */

/**
 * @swagger
 * tags:
 *  name: Educations
 *  description: Access to educations API
 */

/**
 * @swagger
 * /api/v1/educations/user-id={id}:
 *  get:
 *      summary: Returns developer's educations
 *      tags: [Educations]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The user id
 *      responses:
 *          200:
 *              description: The list of the educations
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Education'
 *          400:
 *              description: Invalid input
 */
router.get('/user-id=:id', async (req, res) => {
    //Check role
    const user = await User.findOne({ _id: req.params.id });
    if (user.role != 'Developer') return res.status(400).send("Invalid user id")

    const educations = await Education.find({ user_id: req.params.id });
    res.send({ educations: educations });
});



/**
 * @swagger
 * /api/v1/educations:
 *  post:
 *      summary: Create new education
 *      tags: [Educations]
 *      security:
 *          - auth-token: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Education'
 *      responses:
 *          200:
 *              description: The education was successfully create
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Education'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Some error happened
 */
router.post('/', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');

    //Validate the data
    const { error } = createEducationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const education = new Education({
        school_name: req.body.school_name,
        from_year: req.body.from_year,
        to_year: req.body.to_year,
        is_studying: req.body.is_studying,
        majors: req.body.majors,
        user_id: req.user._id,
    });
    try {
        const saved = await education.save();
        res.send({ education: saved });
    } catch (error) {
        res.status(400).send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/educations/{id}:
 *  put:
 *      summary: Update education by id
 *      tags: [Educations]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The education id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Education'
 *      responses:
 *          200:
 *              description: The education has updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Education'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Some error happened
 */
router.put('/:id', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');

    //Check education
    const edu = await Education.findOne({ user_id: req.user._id, _id: req.params.id });
    if (!edu) return res.status(404).send("Education was not found!")

    //Validate the data
    const { error } = createEducationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        await Education.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    school_name: req.body.school_name,
                    from_year: req.body.from_year,
                    to_year: req.body.to_year,
                    is_studying: req.body.is_studying,
                    majors: req.body.majors,
                }
            }
        )
        const updated = await Education.findOne({ _id: req.params.id });
        res.send({ updatedEducation: updated });
    } catch (error) {
        res.status(400).send(error.message);
    }
});




/**
 * @swagger
 * /api/v1/educations/{id}:
 *  delete:
 *      summary: Delete education by id
 *      tags: [Educations]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The education id
 *      responses:
 *          200:
 *              description: The education was removed
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The education was not found
 */
router.delete('/:id', verify, async (req, res) => {
    //Check role
    if (req.user.role != 'Developer') return res.status(401).send('Role Access Denied: Only Developer can access this API');

    //Check education
    const edu = await Education.findOne({ user_id: req.user._id, _id: req.params.id });
    if (!edu) return res.status(404).send("Education was not found!")
    try {
        await Education.findByIdAndDelete(req.params.id);
        res.send("This education has been deleted successfully!!");
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});
/**
 * @swagger
 * /api/v1/educations/{id}:
 *  get:
 *      summary: Get the education by id
 *      tags: [Educations]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The education id
 *      responses:
 *          200:
 *              description: The education detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Education'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The education was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (education == null) {
            res.status(404);
            res.send({ message: 'The education was not found' })
        } else {
            res.send(education);
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});




module.exports = router;