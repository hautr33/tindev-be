const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const Developer = require('../models/Developer');
const Matching = require('../models/Matching');

const verify = require('../utilities/verifyToken');

/**
 * @swagger
 * components:
 *  schemas:
 *      Matching:
 *          type: object
 *          required:
 *              - company_user_id
 *              - developer_user_id
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id
 *                  example: 60be30327d1e161ce0ef4bc9
 *              company_user_id:
 *                  type: string
 *                  description: The company_user_id
 *              developer_user_id:
 *                  type: string
 *                  description: The developer_user_id
 *              job_recruitment_id:
 *                  type: string
 *                  description: The job_recruitment_id
 *              is_company_like:
 *                  type: boolean
 *                  description: The is_company_like
 *              is_developer_like:
 *                  type: boolean
 *                  description: The is_developer_like
 */

/**
 * @swagger
 * tags:
 *  name: Matchings
 *  description: Access to cities API
 */



/**
 * @swagger
 * /api/v1/matchings:
 *  get:
 *      summary: Returns the list of all matched
 *      tags: [Matchings]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The list of the matching
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 */
router.get('/', verify, async (req, res) => {
    if (req.user.role == 'Company') {
        const matchings = await Matching.find(
            {
                company_user_id: req.user._id,
                is_company_like: true,
                is_developer_like: true
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].developer_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const dev = await Developer.findOne({ user_id: matchings[i].developer_user_id })
                list.push(dev)
                list_id.push(matchings[i].developer_user_id)
            }
        }
        res.send({ companies: list });
    } else if (req.user.role == 'Developer') {
        const matchings = await Matching.find(
            {
                developer_user_id: req.user._id,
                is_company_like: true,
                is_developer_like: true
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].company_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const com = await Company.findOne({ user_id: matchings[i].company_user_id })
                list.push(com)
                list_id.push(matchings[i].company_user_id)
            }
        }
        res.send({ companies: list });
    }
});

/**
 * @swagger
 * /api/v1/matchings/liked:
 *  get:
 *      summary: Returns the list of all people that liked you
 *      tags: [Matchings]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The list of likes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 */
router.get('/liked', verify, async (req, res) => {
    if (req.user.role == 'Company') {
        const matchings = await Matching.find(
            {
                company_user_id: req.user._id,
                is_developer_like: true
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].developer_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const dev = await Developer.findOne({ user_id: matchings[i].developer_user_id })
                list.push(dev)
                list_id.push(matchings[i].developer_user_id)
            }
        }
        res.send({ companies: list });
    } else if (req.user.role == 'Developer') {
        const matchings = await Matching.find(
            {
                developer_user_id: req.user._id,
                is_company_like: true
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].company_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const com = await Company.findOne({ user_id: matchings[i].company_user_id })
                list.push(com)
                list_id.push(matchings[i].company_user_id)
            }
        }
        res.send({ companies: list });
    }
});


/**
 * @swagger
 * /api/v1/matchings/disliked:
 *  get:
 *      summary: Returns the list of all people that you disliked
 *      tags: [Matchings]
 *      security:
 *          - auth-token: []
 *      responses:
 *          200:
 *              description: The list of disliked
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 */
router.get('/disliked', verify, async (req, res) => {
    if (req.user.role == 'Company') {
        const matchings = await Matching.find(
            {
                company_user_id: req.user._id,
                is_company_like: false,
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].developer_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const dev = await Developer.findOne({ user_id: matchings[i].developer_user_id })
                list.push(dev)
                list_id.push(matchings[i].developer_user_id)
            }
        }
        res.send({ companies: list });
    } else if (req.user.role == 'Developer') {
        const matchings = await Matching.find(
            {
                developer_user_id: req.user._id,
                is_developer_like: false
            });
        const list = []
        const list_id = []
        for (i = 0; i < matchings.length; i++) {
            let check = false;
            for (j = 0; j < list_id.length; j++) {
                if (matchings[i].company_user_id == list_id[j]) {
                    check = true
                    break
                }
            }
            if (!check) {
                const com = await Company.findOne({ user_id: matchings[i].company_user_id })
                list.push(com)
                list_id.push(matchings[i].company_user_id)
            }
        }
        res.send({ companies: list });
    }
});






module.exports = router;