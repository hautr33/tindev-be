//Validation
const Joi = require('joi');

//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('Developer', 'Company').required(),
        developer: Joi.object({
            full_name: Joi.string().min(6).required(),
            photo_id: Joi.string().empty(""),
            birthday: Joi.date().required(),
            phone: Joi.string().length(10).pattern(/^[0][0-9]+$/).required(),
            gender: Joi.string().valid('Male', 'Female').required(),
            city: Joi.string().required(),
            facebook_url: Joi.string().empty(""),
            linkedin_url: Joi.string().empty(""),
            twitter_url: Joi.string().empty(""),
            description: Joi.string().empty(""),
            job_expectation: Joi.object({
                job_type: Joi.string().required(),
                year_experience: Joi.number().integer().required().greater(0),
                expected_salary: Joi.number().integer().required().greater(0),
                work_place: Joi.string().required(),
            }),
            skills: Joi.array().items(Joi.string().required()),
        }),
        company: Joi.object({
            name: Joi.string().min(6).required(),
            photo_id: Joi.string().empty(""),
            phone: Joi.string().length(10).pattern(/^[0][0-9]+$/).required(),
            city: Joi.string().required(),
            tax_code: Joi.string().required(),
            facebook_url: Joi.string().empty(""),
            linkedin_url: Joi.string().empty(""),
            twitter_url: Joi.string().empty(""),
            description: Joi.string().empty(""),
        }),
    });
    return schema.validate(data);
}

//Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

//Forgot Password Validation
const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
    });
    return schema.validate(data);
}


//Update Company Validation
const updateCompanyValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        photo_id: Joi.string().empty(""),
        phone: Joi.string().required(),
        city: Joi.string().required(),
        tax_code: Joi.string().required(),
        facebook_url: Joi.string().empty(""),
        linkedin_url: Joi.string().empty(""),
        twitter_url: Joi.string().empty(""),
        description: Joi.string().empty(""),
    });
    return schema.validate(data);
}


//Update Developer Validation
const updateDeveloperValidation = (data) => {
    const schema = Joi.object({
        full_name: Joi.string().min(6).required(),
        photo_id: Joi.string().empty(""),
        birthday: Joi.date().required(),
        phone: Joi.string().required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        city: Joi.string().required(),
        facebook_url: Joi.string().empty(""),
        linkedin_url: Joi.string().empty(""),
        twitter_url: Joi.string().empty(""),
        description: Joi.string().empty(""),
        job_expectation: Joi.object({
            job_type: Joi.string().required(),
            year_experience: Joi.number().integer().required().greater(0),
            expected_salary: Joi.number().integer().required().greater(0),
            work_place: Joi.string().required(),
        }),
        skills: Joi.array().items(Joi.string().required()),
    });
    return schema.validate(data);
}

//Create Job Recruitment Validation
const createJobRecruitmentValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        work_place: Joi.string().required(),
        expiried_date: Joi.date().required(),
        from_salary: Joi.number().integer().required().greater(0),
        to_salary: Joi.number().integer().required().greater(Joi.ref('from_salary')),
        job_type: Joi.string().required(),
        skills: Joi.array().items(Joi.string().required()),
        year_experience: Joi.number().integer().required().greater(0),
        description: Joi.string().empty(""),
    });
    return schema.validate(data);
}

//Update Job Recruitment Validation
const updateJobRecruitmentValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(6).required(),
        work_place: Joi.string().required(),
        expiried_date: Joi.date().required(),
        from_salary: Joi.number().integer().required().greater(0),
        to_salary: Joi.number().integer().required().greater(Joi.ref('from_salary')),
        job_type: Joi.string().required(),
        skills: Joi.array().items(Joi.string().required()),
        year_experience: Joi.number().integer().required().greater(0),
        description: Joi.string().empty(""),
    });
    return schema.validate(data);
}

//Create Education Validation
const createEducationValidation = (data) => {
    const schema = Joi.object({
        school_name: Joi.string().min(6).required(),
        from_year: Joi.number().integer().greater(1900).max(2021),
        to_year: Joi.number().integer().greater(Joi.ref('from_year')).max(2025),
        is_studying: Joi.boolean(),
        majors: Joi.string()
    });
    return schema.validate(data);
}





module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.updateCompanyValidation = updateCompanyValidation;
module.exports.updateDeveloperValidation = updateDeveloperValidation;
module.exports.createJobRecruitmentValidation = createJobRecruitmentValidation;
module.exports.updateJobRecruitmentValidation = updateJobRecruitmentValidation;
module.exports.createEducationValidation = createEducationValidation;