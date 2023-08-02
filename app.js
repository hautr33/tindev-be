const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const _ = require('lodash');

//Config
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION = process.env.DB_CONNECTION;

//Connect to DB
try {
    mongoose.connect(
        DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('Connected to DB');
        },
        (err) => {
            console.log(err);
        });
} catch (error) {
    console.log(error);
}


//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tindev API',
            version: '1.0.0',
            description: 'This is a Tindev API'
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ],
    },
    apis: ['./routes/*.js']
}
const specs = swaggerJsDoc(options);

//Middlewares
const app = express();
app.use(cors());
app.use(fileUpload({
    createParentPath: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

app.set('view engine', 'ejs')

//Import Routes
const userRoute = require('./routes/users');
const citiesRoute = require('./routes/cities');
const universitiesRoute = require('./routes/universities');
const jobTypesRoute = require('./routes/job_types');
const skillsRoute = require('./routes/skills');
const jobRecruitmentsRoute = require('./routes/job_recruitments');
const companiesRoute = require('./routes/companies');
const albumsRoute = require('./routes/albums');
const developersRoute = require('./routes/developers');
const accountRoute = require('./routes/account');
const matchingRoute = require('./routes/matching');
const educationsRoute = require('./routes/educations');

//Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/cities', citiesRoute);
app.use('/api/v1/universities', universitiesRoute);
app.use('/api/v1/job-types', jobTypesRoute);
app.use('/api/v1/skills', skillsRoute);
app.use('/api/v1/job-recruitments', jobRecruitmentsRoute);
app.use('/api/v1/companies', companiesRoute);
app.use('/api/v1/albums', albumsRoute);
app.use('/api/v1/developers', developersRoute);
app.use('/api/v1/matchings', matchingRoute);
app.use('/api/v1/educations', educationsRoute);
app.use('/account', accountRoute);

app.get('/', (req, res) => {
    res.send('Welcome to Tindev!')
})


//Listenning to port
app.listen(PORT, () => console.log(`The server is running on port ${PORT}, swagger documents: http://localhost:${PORT}/api/docs`));