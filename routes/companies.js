const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const Developer = require('../models/Developer');
const Photo = require('../models/Photo');

const PublitioAPI = require('publitio_js_sdk').default;
const API_KEY = process.env.PUBLIT_IO_API_KEY;
const API_SECRET = process.env.PUBLIT_IO_API_SECRET;
const publitio = new PublitioAPI(API_KEY, API_SECRET);

const { updateCompanyValidation } = require('../utilities/validation');
const verify = require('../utilities/verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *      Company:
 *          type: object
 *          required:
 *              - name
 *              - photo_id
 *              - phone
 *              - city
 *              - tax_code
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of company
 *                  example: 60bf0df7e11b854b208a4470
 *              name:
 *                  type: string
 *                  description: The company name
 *                  example: ABC Company
 *              photo_id:
 *                  type: string
 *                  description: The company profile photo
 *                  example: 60e72a3b304cb20004974fe6
 *              photo_url:
 *                  type: string
 *                  description: The company photo url
 *                  example: https://media.publit.io/file/fil-xra.jpg
 *              email:
 *                  type: string
 *                  description: The company email
 *                  example: recruit-support@abc-co.com
 *              phone:
 *                  type: string
 *                  description: The company phone
 *                  example: '0123456789'
 *              city:
 *                  type: string
 *                  description: The company city
 *                  example: Bắc Giang
 *              tax_code:
 *                  type: string
 *                  description: The company tax code
 *                  example: 1234567890
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
 *                  description: The company description
 *                  example: ABC is designing the future of hyperscale cloud and edge computing with the world’s first cloud native processor. Built for the cloud with a modern 64-bit Arm server-based architecture, ABC gives customers the freedom to accelerate the delivery of all cloud computing applications. With industry-leading cloud performance, power efficiency and scalability, ABC processors are tailored for the continued growth of cloud and edge computing.
 *              user_id:
 *                  type: string
 *                  description: The company user id
 *                  example: 60bf0df7e11b854b208a4470
 *              status:
 *                  type: string
 *                  description: The company's status
 *                  default: "Active"
 *              
 */

/**
 * @swagger
 * tags:
 *  name: Companies
 *  description: Access to companies API
 */


/**
 * @swagger
 * /api/v1/companies/my-info:
 *  get:
 *      summary: Get company information
 *      tags: [Companies]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The company information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The company was not found
 */
router.get('/my-info', verify, async (req, res) => {
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied!');
    try {
        const company = await Company.findOne({ user_id: req.user._id });
        if (company == null) {
            res.status(404);
            res.send('The company was not found')
        } else {
            const photo_url = await getPhotoUrl(company.photo_id);
            company.photo_url = photo_url;
            res.send({ company });
        }
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/companies/my-info:
 *  put:
 *      summary: Update company information
 *      tags: [Companies]
 *      security:
 *          - auth-token: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Company'
 *      responses:
 *          200:
 *              description: The company was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 *          400:
 *              description: Invaluser_id input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The company was not found
 *          500: 
 *              description: Some error happened
 */
router.put('/my-info', verify, async (req, res) => {
    if (req.user.role != 'Company') return res.status(401).send('Role Access Denied!');
    //Validate the data
    const { error } = updateCompanyValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking phone
    const phone_exist = await Developer.findOne({ phone: req.body.phone });
    const phone_exist_2 = await Company.findOne({ phone: req.body.phone, user_id: { $ne: req.user._id } });
    if (phone_exist || phone_exist_2) return res.status(400).send('Phone number \'' + req.body.phone + '\' already exists!');

    const isExist = await Company.findOne({ user_id: req.user._id });
    if (isExist) {
        console.log(req.body.name)
        try {
            var updated = await Company.updateOne(
                { user_id: req.user._id },
                {
                    $set: {
                        name: req.body.name,
                        photo_id: req.body.photo_id,
                        phone: req.body.phone,
                        city: req.body.city,
                        tax_code: req.body.tax_code,
                        facebook_url: req.body.facebook_url,
                        linkedin_url: req.body.linkedin_url,
                        twitter_url: req.body.twitter_url,
                        description: req.body.description,
                    }
                }
            );
            updated = await Company.findOne({ user_id: req.user._id });
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
 * /api/v1/companies:
 *  get:
 *      summary: Returns the list of all the companies
 *      tags: [Companies]
 *      responses:
 *          200:
 *              description: The list of the companies
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Company'
 *          400:
 *              description: Invalid input
 */
router.get('/', async (req, res) => {
    const companies = await Company.find();
    res.send({ companies });
});




/**
 * @swagger
 * /api/v1/companies/user-id={id}:
 *  get:
 *      summary: Get the company by user id
 *      tags: [Companies]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The company user id
 *      responses:
 *          200:
 *              description: The company detail by user id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The company was not found
 */
router.get('/user-id=:id', async (req, res) => {
    try {
        const company = await Company.findOne({ user_id: req.params.id });
        if (company == null) {
            res.status(404);
            res.send('The company was not found')
        } else {
            const photo_url = await getPhotoUrl(company.photo_id);
            company.photo_url = photo_url;
            res.send({ company });
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