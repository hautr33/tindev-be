const express = require('express');
const router = express.Router();

const Album = require('../models/Album');
const Photo = require('../models/Photo');
const User = require('../models/User');

const PublitioAPI = require('publitio_js_sdk').default;
const API_KEY = process.env.PUBLIT_IO_API_KEY;
const API_SECRET = process.env.PUBLIT_IO_API_SECRET;
const publitio = new PublitioAPI(API_KEY, API_SECRET);

const verify = require('../utilities/verifyToken');


/**
 * @swagger
 * components:
 *  schemas:
 *      Album:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of album
 *                  example: 60bf0df7e11b854b208a4470
 *              title:
 *                  type: string
 *                  description: The album title
 *                  example: Profile
 *              description:
 *                  type: string
 *                  description: The album description
 *                  example: Profile
 *              user_id:
 *                  type: string
 *                  description: The album's owner id
 *                  example: Profile
 *              is_deleted:
 *                  type: boolean
 *                  default: false
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Photo:
 *          type: object
 *          required:
 *              - title
 *              - publit_io_id
 *              - album_id
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of photo info
 *                  format: ObjectId
 *                  example: 60bfd4d2ec0c771facb92499
 *              publit_io_id:
 *                  type: string
 *                  description: The id of photo
 *                  example: kMh8mQ2d
 *              album_id:
 *                  type: string
 *                  description: The id of album
 *                  format: ObjectId
 *                  example: 60bfd4d2ec0c771facb92499
 *              title:
 *                  type: string
 *                  description: The photo title
 *                  example: asdhql567asd
 *              url_preview:
 *                  type: string
 *                  description: The photo's preview url
 *                  example: https://media.publit.io/file/fil-MR.jpg
 *              url_thumbnail:
 *                  type: string
 *                  description: The photo's thumbnail url
 *                  example: https://media.publit.io/file/w_300,h_200,c_fill/fil-MR.jpg
 *              description:
 *                  type: string
 *                  description: The photo's description
 *                  example: Hinh đẹp quá ta
 *              is_deleted:
 *                  type: boolean
 *                  default: false
 */



/**
 * @swagger
 * tags:
 *  name: Albums
 *  description: Access to albums API
 */


// /**
//  * @swagger
//  * /api/v1/albums/temp-album/title={title}&description={description}:
//  *  post:
//  *      summary: Upload photo to temp album
//  *      tags: [Albums]
//  *      parameters:
//  *          -   in: path
//  *              name: title
//  *              schema:
//  *                  type: string
//  *              required: true
//  *              description: The photo title
//  *              example: Avatar
//  *          -   in: path
//  *              name: description
//  *              schema:
//  *                  type: string
//  *              required: true
//  *              description: The photo description
//  *              example: Upload avatar
//  *      requestBody:
//  *          required: true
//  *          content:
//  *              multipart/form-data:
//  *                  schema:
//  *                      type: object
//  *                      properties:
//  *                          file:
//  *                              type: string
//  *                              format: binary
//  *      responses:
//  *          200:
//  *              description: The photo was successfully create
//  *              content:
//  *                  application/octet-stream:
//  *                      schema:
//  *                          $ref: '#/components/schemas/Photo'
//  *          400:
//  *              description: Invalid input
//  *          500:
//  *              description: Some error happened
//  */
// router.post('/temp-album/title=:title&description=:description', async (req, res) => {
//     var album = await Album.findOne({ status: "Temp" });
//     if (album == null) {
//         const newAlbum = new Album({
//             title: "Temp Album",
//             user_id: "",
//             description: "Temp Album",
//             status: "Temp",
//         });
//         album = await newAlbum.save();
//     }
//     if (!req.files) {
//         res.send({
//             status: false,
//             message: 'No file uploaded'
//         });
//     } else {
//         const file = req.files.file;
//         if (file.mimetype.includes('image')) {
//             await publitio.uploadFile(file.data, 'file')
//                 .then(data => {
//                     result = data;
//                 })
//                 .catch(error => { res.status(500).send(error.message); });
//             if (result.success) {
//                 const photo = new Photo({
//                     title: req.params.title,
//                     publit_io_id: result.id,
//                     album_id: album._id,
//                     description: req.params.description,
//                 });
//                 const savedPhoto = await photo.save();
//                 savedPhoto.url_preview = result.url_preview;
//                 savedPhoto.url_thumbnail = result.url_thumbnail;
//                 res.send({ savedPhoto });
//             } else {
//                 res.status(500).send("Some error happened!")
//             }
//         } else {
//             res.status(400).send("Please upload an image!")
//         }
//     }
// });


/**
 * @swagger
 * /api/v1/albums/user-id={id}:
 *  get:
 *      summary: Returns all album of user
 *      tags: [Albums]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The user id
 *      responses:
 *          200:
 *              description: The list of the albums
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Album'
 *          500:
 *              description: Some error happened
 */
router.get('/user-id=:id', async (req, res) => {
    const albums = await Album.find({ is_deleted: false, user_id: req.params.id });
    res.send({ albums: albums });
});


/**
 * @swagger
 * /api/v1/albums:
 *  post:
 *      summary: Create new album of user
 *      tags: [Albums]
 *      security:
 *          - auth-token: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Album'
 *      responses:
 *          200:
 *              description: The album was successfully create
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Album'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', verify, async (req, res) => {
    //Check user
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(404).send("Invalid user");

    const album = new Album({
        title: req.body.title,
        description: req.body.description,
        user_id: req.user._id,
    });
    try {
        const saved = await album.save();
        res.send({ album: saved });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /api/v1/albums/{id}:
 *  get:
 *      summary: Get the album by id
 *      tags: [Albums]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The album id
 *      responses:
 *          200:
 *              description: The album detail by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Album'
 *          400:
 *              description: Invalid input
 *          404:
 *              description: The album was not found
 */
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findOne({ _id: req.params.id, is_deleted: false });
        if (album == null) {
            res.status(404);
            res.send('The album was not found');
        } else {
            res.send({ album });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});



/**
 * @swagger
 * /api/v1/albums/{id}:
 *  put:
 *      summary: Update the album by id
 *      tags: [Albums]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The album id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Album'
 *      responses:
 *          200:
 *              description: The album was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Album'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The album was not found
 */
router.put('/:id', verify, async (req, res) => {
    const album = await Album.findOne({ _id: req.params.id, user_id: req.user._id, is_deleted: false })
    if (!album) return res.status(404).send("The album was not found");

    try {
        const updated = await Album.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                }
            }
        );
        updated = await Album.findById(req.params.id);
        res.send({ updatedAlbum: updated });
    } catch (error) {
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /api/v1/albums/{id}:
 *  delete:
 *      summary: Delete the album by id
 *      tags: [Albums]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The album id
 *      responses:
 *          200:
 *              description: The album was deleted
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: The album was not found
 */
router.delete('/:id', verify, async (req, res) => {
    const album = await Album.findOne({ _id: req.params.id, user_id: req.user._id, is_deleted: false })
    if (!album) return res.status(404).send("The album was not found");

    try {
        await Album.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    is_deleted: true
                }
            }
        );
        res.send("Album deleted successfully!")
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /api/v1/albums/{id}/photos:
 *  get:
 *      summary: Returns the all photos of album of user
 *      tags: [Albums]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The album id
 *      responses:
 *          200:
 *              description: The list of the photos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Photo'
 *          404:
 *              description: Photo was not found
 *          500:
 *              description: Some error happened
 */
router.get('/:id/photos', async (req, res) => {
    const album = await Album.findOne({ _id: req.params.id, is_deleted: false })
    if (!album) return res.status(404).send("The album was not found");

    try {
        const photos = await Photo.find({ is_deleted: false, album_id: req.params.id });
        for (var i = 0; i < photos.length; i++) {
            await publitio.call(`/files/show/${photos[i].publit_io_id}`, 'GET')
                .then(data => {
                    photos[i].url_preview = data.url_preview;
                    photos[i].url_thumbnail = data.url_thumbnail;
                })
                .catch(error => { resstatus(500).send(error) })
        }
        res.send({ photos });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /api/v1/albums/{id}/photos:
 *  post:
 *      summary: Create new photo
 *      tags: [Albums]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The album id
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: The photo was successfully create
 *              content:
 *                  application/octet-stream:
 *                      schema:
 *                          $ref: '#/components/schemas/Photo'
 *          400:
 *              description: Invalid input
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */


router.post('/:id/photos', verify, async (req, res) => {
    const album = await Album.findOne({ _id: req.params.id, is_deleted: false, user_id: req.user._id })
    if (!album) return res.status(404).send("The album was not found");

    try {
        if (!req.files) return res.send({ status: false, message: 'No file uploaded' });

        const file = req.files.file;
        if (!file.mimetype.includes('image')) return res.status(400).send("Please upload an image!");

        await publitio.uploadFile(file.data, 'file')
            .then(data => {
                result = data;
            })
            .catch(error => { res.status(500).send(error.message); });

        if (!result.success) return res.status(500).send("Some error happened!")

        const photo = new Photo({
            title: file.name.split('.')[0],
            publit_io_id: result.id,
            album_id: req.params.id,
            description: req.params.description,
        });
        const savedPhoto = await photo.save();
        savedPhoto.url_preview = result.url_preview;
        savedPhoto.url_thumbnail = result.url_thumbnail;
        res.send({ photo: savedPhoto });
    } catch (err) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /api/v1/albums/photos/{id}:
 *  get:
 *      summary: Get photo by id
 *      tags: [Albums]
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The photo id
 *      responses:
 *          200:
 *              description: The photo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Photo'
 *          404:
 *              description: Photo was not found
 *          500:
 *              description: Some error happened
 */
router.get('/photos/:id', async (req, res) => {
    try {
        const photo = await Photo.findOne({ is_deleted: false, _id: req.params.id });
        if (!photo) return res.status(404).send("The photo was not found");
        res.send({ photo: photo })
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /api/v1/albums/photos/{id}:
 *  delete:
 *      summary: Delete photo by id
 *      tags: [Albums]
 *      security:
 *          - auth-token: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: The photo id
 *      responses:
 *          200:
 *              description: Deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Photo'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: Photo was not found
 *          500:
 *              description: Some error happened
 */
router.delete('/photos/:id', verify, async (req, res) => {
    try {
        const photo = await Photo.findOne({ is_deleted: false, _id: req.params.id });
        if (!photo) return res.status(404).send("The photo was not found");

        const album = await Album.findOne({ is_deleted: false, _id: photo.album_id, user_id: req.user._id })
        if (!album) return res.status(404).send("You can not delete other people's photos");

        await Photo.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    is_deleted: true
                }
            }
        );
        res.send("This photo has been deleted successfully")
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
