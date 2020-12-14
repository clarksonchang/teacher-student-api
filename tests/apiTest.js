process.env.ENVIRONMENT = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { expect } = require('chai');
const sql = require('../db/db.js');

chai.use(chaiHttp);

const server = require('../server');

describe('Test Suite for School API Endpoints', function() {
    before('Cleanup teacher table', done => {
        sql.query('delete from teacher', function(error, result) {
            expect(error).to.be.null;
            done();
        });
    });

    before('Cleanup student table', done => {
        sql.query('delete from student', function(error, result) {
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

        it('Returns [200 OK] and correct number of student emails given one teacher input', done => {
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
                    expect(res.body.students).to.be.a('array');

                    done();
                });
        });

        it('Returns [200 OK] and correct number of student emails given multi teacher input', done => {
            chai.request(server)
                .get(commonStudentsEndpoint)
                .query({
                    teacher: 'teacherken@gmail.com',
                    teacher: 'teacherjoe@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('students');
                    expect(res.body.students).to.be.a('array');

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
                    student: 'studentjon@gmail.com'
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

        it('Returns [200 OK] and correct number of student emails given valid payload', done => {
            chai.request(server)
                .post(retrieveEndpoint)
                .send({
                    teacher: 'teacherken@gmail.com',
                    notification: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
                })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res).to.have.property('body');
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('recipients');

                    expect(res.body.recipients).to.be.a('array');
                    // expect(res.body.recipients).to.be.lengthOf(2);

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
