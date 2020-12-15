('use strict');

const { check } = require('express-validator');

exports.register = [
    check('teacher')
        .exists()
        .withMessage('The `teacher` field is required.')
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage('The `teacher` field must be a valid email address')
        .bail(),
    check('students')
        .exists()
        .withMessage('The `students` field is required.')
        .bail()
        .isArray()
        .withMessage('The `students` field must be an array')
        .bail(),
    check('students.*')
        .isEmail()
        .normalizeEmail()
        .withMessage('The items in `students` array must be valid email addresses')
];

exports.suspend = [
    check('student')
        .exists()
        .withMessage('The `student` field is required.')
        .bail()
        .isString()
        .withMessage('The `student` field must be a string')
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage('The `student` field must be a valid email address.')
        .bail()
];

exports.commonStudents = [
    check('teacher')
        .exists()
        .withMessage('The query string must include the `teacher` field')
        .bail()
];

// exports.commonStudents = [
//     oneOf([
//         [
//             check('teacher')
//                 .exists()
//                 .withMessage('Single teacher: query string must include the `teacher` field')
//                 .bail()
//                 .isString()
//                 .withMessage('Single teacher: `teacher` field must be a string')
//                 .bail()
//                 .isEmail()
//                 .normalizeEmail()
//                 .withMessage('Single teacher: The `teacher` field needs to be a valid email address')
//                 .bail()
//         ],

//         [
//             check('teacher')
//                 .exists()
//                 .withMessage('Multi teacher: query string must include the `teacher` field')
//                 .bail()
//                 .isArray()
//                 .bail(),

//             check('teacher.*')
//                 .isEmail()
//                 .normalizeEmail()
//                 .withMessage('Multi teacher: The `teacher` field needs to all have valid email addresses')
//         ]
//     ])
// ];

exports.retrieveForNotifications = [
    check('teacher')
        .exists()
        .withMessage('The `teacher` field is required.')
        .bail()
        .isString()
        .withMessage('The `teacher` field must be a string')
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage('The `teacher` field must be a valid email address.')
        .bail(),
    check('notification')
        .exists()
        .withMessage('The `notification` field is required.')
        .bail()
        .isString()
        .withMessage('The `notification` field must be a string')
        .bail()
];
