const express = require('express');
const apiController = require('../controllers/apiController.js');
const router = express.Router();
const validationSchema = require('../utils/validationSchema');

// all routes have prefixed /api
router.get('/', (req, res) => {
    res.send({ message: 'I am alive' }).status(200);
});

router.post('/register', validationSchema.register, apiController.register);

router.get('/commonstudents', validationSchema.commonStudents, apiController.commonStudents);

router.post('/suspend', validationSchema.suspend, apiController.suspend);

router.post('/retrievefornotifications', validationSchema.retrieveForNotifications, apiController.retrieveForNotifications);

module.exports = router;

// module.exports = app => {

//     app.post("/api/register", apiController.register);

//     app.get("/api/commonstudents", apiService.getCommonStudentsOfTeachers);

//     app.post("/api/suspend", apiService.suspendStudent);

//     app.post("/api/retrievefornotifications", apiService.checkNotificationRecipients);
// }
