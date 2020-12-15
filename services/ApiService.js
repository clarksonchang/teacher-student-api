('use strict');

const sql = require('../db/db.js');
const TEACHER_TABLE = 'teacher';
const STUDENT_TABLE = 'student';
const TEACHER_STUDENT_TABLE = 'teacher_student';

class ApiService {
    register(teacherEmail, studentEmailList, callback) {
        let registerSql =
            `INSERT IGNORE INTO ${TEACHER_TABLE} (email) VALUES (?);` +
            `INSERT IGNORE INTO ${STUDENT_TABLE} (email) VALUES ?;` +
            `INSERT IGNORE INTO ${TEACHER_STUDENT_TABLE} (teacher_id, student_id) SELECT teacher_id, student_id FROM (SELECT * FROM ${TEACHER_TABLE}) t INNER JOIN (SELECT * FROM ${STUDENT_TABLE}) s ON t.email = ? and s.email in ? and s.is_suspended = 0;`;

        let students = studentEmailList.map(item => [item]);

        sql.query(registerSql, [teacherEmail, students, teacherEmail, [students]], (err, res) => {
            if (err) {
                console.log('SQL/DB Error: ', err);
                callback(err, null);
            } else {
                // console.log('Created number of teachers:', res[0]);
                // console.log('Created number of students:', res[1]);

                callback(null, res);
            }
        });
    }

    commonStudents(teacherList, callback) {
        let commonStudentsSql = `SELECT s.email FROM ${STUDENT_TABLE} s JOIN ${TEACHER_STUDENT_TABLE} ts ON s.student_id = ts.student_id 
        JOIN ${TEACHER_TABLE} t ON t.teacher_id=ts.teacher_id where t.email IN (?) AND s.is_suspended = 0
        GROUP BY s.student_id HAVING count(distinct t.teacher_id) = ?`;

        let numberOfTeachers = typeof teacherList === 'string' ? 1 : teacherList.length;

        sql.query(commonStudentsSql, [teacherList, numberOfTeachers], (err, res) => {
            if (err) {
                console.log('SQL/DB Error: ', err);
                callback(err, null);
            } else {
                // console.log('Retrieved number of common students:', res.length);
                // format results and pass back to controller
                let studentArr = [];

                res.forEach(result => studentArr.push(result.email));
                callback(null, { students: studentArr });
            }
        });
    }

    suspend(studentEmail, callback) {
        let suspendSql = `UPDATE ${STUDENT_TABLE} SET is_suspended = 1 WHERE email = ?;`;

        sql.query(suspendSql, [studentEmail], (err, res) => {
            if (err) {
                console.log('SQL/DB Error: ', err);
                callback(err, null);
            } else {
                // console.log('Number of students suspended:', res.affectedRows);
                callback(null, res);
            }
        });
    }

    retrieveForNotifications(teacher, notification, callback) {
        const emailRegex = /@\S+@\S+/g;
        let mentions = notification.match(emailRegex);
        // console.log('Filtered notification: ', mentions);

        let mentionedStudents = [];
        if (mentions != null) {
            mentions.forEach(mention => {
                //strip away '@' symbol
                mentionedStudents.push(mention.substring(1));
            });
        }
        // console.log('Student emails that were mentioned:', mentionedStudents);

        let retrieveNotificationSql = `SELECT s.email FROM ${STUDENT_TABLE} s JOIN ${TEACHER_STUDENT_TABLE} ts ON s.student_id = ts.student_id JOIN ${TEACHER_TABLE} t ON t.teacher_id=ts.teacher_id where t.email = ? AND s.is_suspended = 0
        UNION
        SELECT s2.email FROM ${STUDENT_TABLE} s2 where s2.email IN ? AND s2.is_suspended = 0;`;

        sql.query(retrieveNotificationSql, [teacher, [mentionedStudents]], (err, res) => {
            if (err) {
                console.log('SQL/DB Error: ', err);
                callback(err, null);
            } else {
                // console.log('Retrieved number of rows:', res.length);

                // format results and pass back to controller
                let studentArr = [];
                res.forEach(result => studentArr.push(result.email));
                callback(null, { recipients: studentArr });
            }
        });
    }
}

module.exports = ApiService;
