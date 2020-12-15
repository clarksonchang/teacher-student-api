('use strict');

const apiService = require('../services/apiService');
const { check, validationResult } = require('express-validator');
const HttpException = require('../utils/HttpException');

const register = async (req, res, next) => {
    try {
        // Validate request
        validate(req);

        // Parse request body
        const { teacher, students } = req.body;

        apiService.register(teacher, students, (err, data) => {
            if (err) {
                res.status(500).json({
                    message: err.message || 'Internal Server Error'
                });
            } else {
                res.status(204).json(data);
            }
        });
    } catch (e) {
        res.status(e.status).send({ message: e.message, ...e.data });
    }
};

const commonStudents = async (req, res, next) => {
    try {
        // Validate request - this only checks for existence of the field, had to find workaround for running conditional validation of express-validator
        validate(req);

        // console.log(req.query.teacher);
        // Parse request body
        let teacher = req.query.teacher;

        if (Object.keys(req.query).length > 1) {
            throw new HttpException(400, 'Bad request - extra params', {});
        }

        if (typeof teacher === 'string') {
            const validateResult = await check('teacher')
                .isEmail()
                .normalizeEmail()
                .withMessage('Single teacher: The `teacher` field needs to be a valid email address')
                .run(req);
            if (validateResult.errors.length) {
                throw new HttpException(400, 'Bad request', validateResult);
            }
        } else {
            if (teacher.length === 1) {
                throw new HttpException(400, 'Bad request - if there is only one teacher, please pass in a string instead of a single-indexed array', {});
            }

            const validateResult = await check('teacher.*')
                .isEmail()
                .normalizeEmail()
                .withMessage('Multi teacher: The `teacher` field needs to all have valid email addresses')
                .run(req);
            if (validateResult.errors.length) {
                throw new HttpException(400, 'Bad request', validateResult);
            }
        }

        apiService.commonStudents(teacher, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Internal Server Error'
                });
            } else {
                res.status(200).send(data);
            }
        });
    } catch (e) {
        // console.log(e.data.errors[0]);
        // let errArray = [];
        // if (typeof req.query.teacher === 'string') {
        //     errArray.push({ msg: e.data.errors[0].nestedErrors[0].msg });
        // } else {
        //     errArray.push({ msg: e.data.errors[0].nestedErrors[1].msg });
        // }
        res.status(e.status).send({ message: e.message, errors: e.data.errors });
    }
};

const suspend = async (req, res, next) => {
    try {
        // Validate request
        validate(req);

        // Parse request body
        const { student } = req.body;

        apiService.suspend(student, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Internal Server Error'
                });
            } else {
                res.status(204).send(data);
            }
        });
    } catch (e) {
        res.status(e.status).send({ message: e.message, ...e.data });
    }
};

const retrieveForNotifications = async (req, res, next) => {
    try {
        // Validate request
        validate(req);

        // Parse request body
        const { teacher, notification } = req.body;

        apiService.retrieveForNotifications(teacher, notification, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Internal Server Error'
                });
            } else {
                res.status(200).send(data);
            }
        });
    } catch (e) {
        res.status(e.status).send({ message: e.message, ...e.data });
    }
};

const validate = req => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Bad request', errors);
    }
};

module.exports = {
    register,
    suspend,
    commonStudents,
    retrieveForNotifications
};
