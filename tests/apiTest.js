('use strict');
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { expect } = require('chai');
const dotenv = require('dotenv');

dotenv.config();
if (process.env.DB_DATABASE_TEST !== 'test_school_db') {
    console.log('The `test` environment is not configured properly, please check. Aborting test to prevent possible wipe of non-test data');
    return;
}

const TEACHER_TABLE = 'teacher';
const STUDENT_TABLE = 'student';
const TEACHER_STUDENT_TABLE = 'teacher_student';

chai.use(chaiHttp);

const sql = require('../db/db.js');
const server = require('../server');

describe('Test Suite for School API Endpoints', function() {
    before('Cleanup teacher table', done => {
        console.log('[Setup] Cleanup teacher table');

        sql.query(`delete from ${TEACHER_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    before('Cleanup student table', done => {
        console.log('[Setup] Cleanup student table');

        sql.query(`delete from ${STUDENT_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    before('Cleanup teacher_student table', done => {
        console.log('[Setup] Cleanup teacher table');

        sql.query(`delete from ${TEACHER_STUDENT_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    after('Cleanup teacher table', done => {
        console.log('[Teardown] Cleanup teacher table');

        sql.query(`delete from ${TEACHER_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    after('Cleanup student table', done => {
        console.log('[Teardown] Cleanup student table');

        sql.query(`delete from ${STUDENT_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    after('Cleanup teacher_student table', done => {
        console.log('[Teardown] Cleanup teacher table');

        sql.query(`delete from ${TEACHER_STUDENT_TABLE}`, function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    describe('0. General Server Tests', done => {
        it('Returns [200 OK] when given the base route', done => {
            chai.request(server)
                .get('/api')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.status(200);
                    expect(res).to.have.property('body');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.eql('I am alive');

                    done();
                });
        });

        it('Returns [404 Not Found] when given a non-existent route', done => {
            chai.request(server)
                .get('/api/teachers')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.status(404);

                    done();
                });
        });
    });

    describe('1. Test POST /api/register endpoint', done => {
        it('Returns [204 Created] given valid payload', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    teacher: 'teacherken@gmail.com',
                    students: ['studentjon@gmail.com', 'studenthon@gmail.com']
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(204);

                    done();
                });
        });

        it('Returns [400 Bad Request] due to empty payload', done => {
            chai.request(server)
                .post('/api/register')
                .send({})
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to lack of teacher field', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    students: ['studentjon@gmail.com', 'studenthon@gmail.com']
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to lack of student field', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    teacher: 'teacherken@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to invalid email in teacher field', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    teacher: 'abc@gmail@Comment',
                    students: ['studentjon@gmail.com', 'studenthon@gmail.com']
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to invalid email in student array', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    teacher: 'teacherken@gmail.com',
                    students: ['studentjon@gmail@com', 'studenthon@gmail.com']
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to student field not being an array', done => {
            chai.request(server)
                .post('/api/register')
                .send({
                    teacher: 'teacherken@gmail.com',
                    students: 'studentjon@gmail@com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });
    });

    describe('2. Test GET /api/commonstudents endpoint', done => {
        const commonStudentsEndpoint = '/api/commonstudents';

        before('Cleanup teacher table', done => {
            console.log('[Setup] Cleanup teacher table');

            sql.query('delete from teacher', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });
        before('Cleanup student table', done => {
            console.log('[Setup] Cleanup student table');

            sql.query('delete from student', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });
        before('Cleanup teacher_student table', done => {
            console.log('[Setup] Cleanup teacher_student table');

            sql.query('delete from teacher_student', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });

        before('Insert sample data (teacherken@gmail with 5 students)', done => {
            console.log('[Setup] Insert sample data (teacherken@gmail with 5 students)');

            let teacherEmail = 'teacherken@gmail.com';
            let students = [['commonstudent1@gmail.com'], ['commonstudent2@gmail.com'], ['studentA@gmail.com'], ['studentB@gmail.com'], ['student_only_under_ken@gmail.com']];
            sql.query(
                `INSERT IGNORE INTO ${TEACHER_TABLE} (email) VALUES (?);` +
                    `INSERT IGNORE INTO ${STUDENT_TABLE} (email) VALUES ?;` +
                    `INSERT IGNORE INTO ${TEACHER_STUDENT_TABLE} (teacher_id, student_id) SELECT teacher_id, student_id FROM (SELECT * FROM ${TEACHER_TABLE}) t INNER JOIN (SELECT * FROM ${STUDENT_TABLE}) s ON t.email = ? and s.email in ? and s.is_suspended = 0;`,
                [teacherEmail, students, teacherEmail, [students]],
                (err, res) => {
                    if (err) {
                        console.log('SQL/DB Error: ', err);
                        callback(err, null);
                    } else {
                        done();
                    }
                }
            );
        });

        before('Insert sample data (teacherjoe@gmail with 4 students)', done => {
            console.log('[Setup] Insert sample data (teacherjoe@gmail with 4 students)');

            let teacherEmail = 'teacherjoe@gmail.com';
            let students = [['commonstudent1@gmail.com'], ['commonstudent2@gmail.com'], ['student_only_under_joe@gmail.com'], ['studentToBeSuspended@gmail.com']];
            sql.query(
                `INSERT IGNORE INTO ${TEACHER_TABLE} (email) VALUES (?);` +
                    `INSERT IGNORE INTO ${STUDENT_TABLE} (email) VALUES ?;` +
                    `INSERT IGNORE INTO ${TEACHER_STUDENT_TABLE} (teacher_id, student_id) SELECT teacher_id, student_id FROM (SELECT * FROM ${TEACHER_TABLE}) t INNER JOIN (SELECT * FROM ${STUDENT_TABLE}) s ON t.email = ? and s.email in ? and s.is_suspended = 0;`,
                [teacherEmail, students, teacherEmail, [students]],
                (err, res) => {
                    if (err) {
                        console.log('SQL/DB Error: ', err);
                        callback(err, null);
                    } else {
                        done();
                    }
                }
            );
        });

        it('Returns [200 OK] and correct student emails given teacherken@gmail input', done => {
            chai.request(server)
                .get(commonStudentsEndpoint)
                .query({
                    teacher: 'teacherken@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('students');
                    expect(res.body.students).to.be.lengthOf(5);
                    expect(res.body.students).to.be.a('array');
                    expect(res.body.students).to.include.members([
                        'commonstudent1@gmail.com',
                        'commonstudent2@gmail.com',
                        'studentA@gmail.com',
                        'studentB@gmail.com',
                        'student_only_under_ken@gmail.com'
                    ]);

                    done();
                });
        });

        it('Returns [200 OK] and correct student emails given 2 teachers teacherken@gmail.com teacherjoe@gmail.com', done => {
            chai.request(server)
                .get(commonStudentsEndpoint + '?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com')
                // .query({
                //     teacher: 'teacherken@gmail.com',
                //     teacher: 'teacherjoe@gmail.com'
                // })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('students');
                    expect(res.body.students).to.be.lengthOf(2);
                    expect(res.body.students).to.be.a('array');
                    expect(res.body.students).to.include.members(['commonstudent1@gmail.com', 'commonstudent2@gmail.com']);

                    done();
                });
        });

        it('Returns [400 Bad Request] due to empty query string', done => {
            chai.request(server)
                .get(commonStudentsEndpoint)
                .query({})
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due invalid email in teacher field', done => {
            chai.request(server)
                .get(commonStudentsEndpoint)
                .query({
                    teacher: 'teacherken@gmail@com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to invalid emails in teacher field', done => {
            chai.request(server)
                .get(commonStudentsEndpoint)
                .query({
                    teacher: 'abc@gmail.com',
                    teacher: 'abc@gmail@com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });
    });

    describe('3. Test POST /api/suspend endpoint', done => {
        const suspendEndpoint = '/api/suspend';
        it('Returns [204 Created] given valid payload', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    student: 'studentToBeSuspended@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(204);
                    sql.query(`SELECT is_suspended FROM ${STUDENT_TABLE} where email='studentToBeSuspended@gmail.com';`, [], (err, result) => {
                        if (err) {
                            console.log('SQL/DB Error: ', err);
                        } else {
                            // is_suspended flag should return 1;
                            expect(result[0].is_suspended).to.be.equal(1);
                        }
                    });

                    done();
                });
        });

        it('Returns [304 Not Modified] when try to suspend already suspended student', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    student: 'studentToBeSuspended@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(304);

                    done();
                });
        });

        it('Returns [404 Not Found] when try to suspend non-existent student', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    student: 'janedoe@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(404);

                    done();
                });
        });

        it('Returns [400 Bad Request] due to empty payload', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({})
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to lack of student field', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    teacher: 'studentjon@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to student field being non-string', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    student: ['teacherken@gmail.com']
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to invalid email in student field', done => {
            chai.request(server)
                .post(suspendEndpoint)
                .send({
                    student: 'abc@gmail@Comment'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });
    });

    describe('4. Test POST /api/retrievefornotifications endpoint', done => {
        const retrieveEndpoint = '/api/retrievefornotifications';

        before('Cleanup teacher table', done => {
            console.log('[Setup] Cleanup teacher table');

            sql.query('delete from teacher', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });
        before('Cleanup student table', done => {
            console.log('[Setup] Cleanup student table');

            sql.query('delete from student', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });
        before('Cleanup teacher_student table', done => {
            console.log('[Setup] Cleanup teacher_student table');

            sql.query('delete from teacher_student', function(error, result) {
                expect(error).to.be.null;
                done();
            });
        });

        before('Insert sample data (teacherken@gmail with 5 students)', done => {
            console.log('[Setup] Insert sample data (teacherken@gmail with 5 students)');

            let teacherEmail = 'teacherken@gmail.com';
            let students = [['commonstudent1@gmail.com'], ['commonstudent2@gmail.com'], ['studentA@gmail.com'], ['studentB@gmail.com'], ['student_only_under_ken@gmail.com']];
            sql.query(
                `INSERT IGNORE INTO ${TEACHER_TABLE} (email) VALUES (?);` +
                    `INSERT IGNORE INTO ${STUDENT_TABLE} (email) VALUES ?;` +
                    `INSERT IGNORE INTO ${TEACHER_STUDENT_TABLE} (teacher_id, student_id) SELECT teacher_id, student_id FROM (SELECT * FROM ${TEACHER_TABLE}) t INNER JOIN (SELECT * FROM ${STUDENT_TABLE}) s ON t.email = ? and s.email in ? and s.is_suspended = 0;`,
                [teacherEmail, students, teacherEmail, [students]],
                (err, res) => {
                    if (err) {
                        console.log('SQL/DB Error: ', err);
                        callback(err, null);
                    } else {
                        done();
                    }
                }
            );
        });

        before('Insert sample data (teacherjoe@gmail with 4 students)', done => {
            console.log('[Setup] Insert sample data (teacherjoe@gmail with 4 students)');

            let teacherEmail = 'teacherjoe@gmail.com';
            let students = [['commonstudent1@gmail.com'], ['commonstudent2@gmail.com'], ['student_only_under_joe@gmail.com'], ['studentToBeSuspended@gmail.com']];
            sql.query(
                `INSERT IGNORE INTO ${TEACHER_TABLE} (email) VALUES (?);` +
                    `INSERT IGNORE INTO ${STUDENT_TABLE} (email) VALUES ?;` +
                    `INSERT IGNORE INTO ${TEACHER_STUDENT_TABLE} (teacher_id, student_id) SELECT teacher_id, student_id FROM (SELECT * FROM ${TEACHER_TABLE}) t INNER JOIN (SELECT * FROM ${STUDENT_TABLE}) s ON t.email = ? and s.email in ? and s.is_suspended = 0;`,
                [teacherEmail, students, teacherEmail, [students]],
                (err, res) => {
                    if (err) {
                        console.log('SQL/DB Error: ', err);
                        callback(err, null);
                    } else {
                        done();
                    }
                }
            );
        });

        before('Suspend 1 student for test purposes (studentToBeSuspended@gmail.com))', done => {
            console.log('[Setup] Suspend 1 student (studentToBeSuspended@gmail.com)');

            let suspendSql = `UPDATE ${STUDENT_TABLE} SET is_suspended = 1 WHERE email = 'studentToBeSuspended@gmail.com';`;

            sql.query(suspendSql, [], (err, res) => {
                if (err) {
                    console.log('SQL/DB Error: ', err);
                } else {
                    done();
                }
            });
        });

        it('Returns [200 OK] and correct student emails given valid payload', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! @student_only_under_joe@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('recipients');
                    expect(res.body.recipients).to.be.a('array');
                    expect(res.body.recipients).to.be.lengthOf(5 + 1);
                    expect(res.body.recipients).to.include.members([
                        'commonstudent1@gmail.com',
                        'commonstudent2@gmail.com',
                        'studentA@gmail.com',
                        'studentB@gmail.com',
                        'student_only_under_ken@gmail.com',
                        'student_only_under_joe@gmail.com'
                    ]);

                    done();
                });
        });

        it('Returns [200 OK] and correct student emails (excluding suspended ones) given valid payload', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: 'teacherjoe@gmail.com',
                    notification: 'Hello students! @student_only_under_ken@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('recipients');
                    expect(res.body.recipients).to.be.a('array');
                    expect(res.body.recipients).to.be.lengthOf(4);
                    expect(res.body.recipients).to.include.members(['commonstudent1@gmail.com', 'commonstudent2@gmail.com', 'student_only_under_joe@gmail.com', 'student_only_under_ken@gmail.com']);
                    expect(res.body.recipients).to.not.include.members(['studentToBeSuspended@gmail.com']);

                    done();
                });
        });

        it('Returns [200 OK] and correct student emails (excluding suspended ones) given payload with non-registered student mentioned', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: 'teacherjoe@gmail.com',
                    notification: 'Hello students! @student_only_under_ken@gmail.com @newstudent@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('recipients');
                    expect(res.body.recipients).to.be.a('array');
                    expect(res.body.recipients).to.be.lengthOf(4);
                    expect(res.body.recipients).to.include.members(['commonstudent1@gmail.com', 'commonstudent2@gmail.com', 'student_only_under_joe@gmail.com', 'student_only_under_ken@gmail.com']);
                    expect(res.body.recipients).to.not.include.members(['studentToBeSuspended@gmail.com', 'newstudent@gmail.com']);

                    done();
                });
        });

        it('Returns [400 Bad Request] due to empty payload', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({})
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to lack of teacher field', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    // teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to lack of malformed email in mentions', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    // teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! @studentagnes@gmail@com @studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });
        it('Returns [400 Bad Request] due to lack of @ when mentioning emails', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    // teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! studentagnes@gmail@com studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to non-compliance to mentioning format', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    // teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! #studentagnes@gmail@com #studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to teacher field being non-string', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: ['teacherken@gmail.com'],
                    notification: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });

        it('Returns [400 Bad Request] due to invalid email in teacher field', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: 'abc@gmail@Comment',
                    notification: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('errors');

                    done();
                });
        });
    });
});
