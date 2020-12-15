# `teacher-admin-api` Assessment Submission

## Stack details

-   App layer:
    -   Backend: [Node.js](https://nodejs.org/en/download/) + [Express](http://expressjs.com/)
    -   Validator library: [express-validator](https://express-validator.github.io/)
-   Database layer: [MySQL](https://dev.mysql.com/downloads/mysql/)
-   Test Suite: [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/)

The production environment is hosted on AWS using Elastic Beanstalk and RDS.

## Pre-requisites (for local setup)

These need to be installed on your local machine for the local setup to work:

-   Node JS: [How to install Node.js](https://nodejs.org/en/download/)
-   MySQL Server: [How to install MySQL Server](https://dev.mysql.com/doc/refman/8.0/en/installing.html)

## Instructions for local setup

Follow these steps to get the development environment running.

If you want to test the endpoints without setup, use the production environment endpoints (see [Link to API Endpoints section](#link-to-api-endpoints)).

1. Open a terminal, clone the repository into a folder on your local machine (the home directory `/~` is used in this example):

    ```bash
    cd ~
    git clone https://github.com/clarksonchang/teacher-student-api.git
    ```

2. Navigate to the project folder, and install the required dependencies:

    ```bash
    cd ~/teacher-student-api
    npm i
    ```

3. Create an empty `.env` file at the in the project's root directory (`~/teacher-student-api/`)

    ```bash
    cd ~/teacher-student-api/
    touch .env
    ```

4. Assuming your local MySQL server is set up, run the 2 SQL scripts in `~/teacher-student-api/db/scripts` to create the 2 database schema and its necessary tables:

    - `school_db` (for `development` environment)
    - `test_school_db` (for `test` environment)

5. Update the `.env` file with your local database configurations, using `env.example` as the template.  
   Contents of `.env.example` are shown below:

    ```bash
    # DB Configurations (DEVELOPMENT ENV)
    DB_HOST_DEVELOPMENT=localhost
    DB_USER_DEVELOPMENT=root
    DB_PASSWORD_DEVELOPMENT=password
    DB_PORT_DEVELOPMENT=3306
    DB_DATABASE_DEVELOPMENT=school_db

    # DB Configurations (TEST ENV)
    DB_HOST_TEST=localhost
    DB_USER_TEST=root
    DB_PASSWORD_TEST=password
    DB_PORT_TEST=3306
    DB_DATABASE_TEST=test_school_db

    #local runtime configs
    PORT=3000
    ```

6. To start the server in development mode:

    ```bash
    cd ~/teacher-student-api
    npm run start:dev
    ```

    To run the mocha test suite:

    ```bash
    cd ~/teacher-student-api
    npm test
    ```

7. If you ran the server in development mode, you should see the following message:
    ```
    Server (DEVELOPMENT) is listening on port 3000
    ```
    Test that the server is responsive by opening a new terminal, and typing the following command
    ```bash
    curl localhost:3000/api
    ```
    You should get the following JSON response:
    ```json
    { "message": "I am alive" }
    ```
8. You can now proceed to use the endpoints defined in the next section.

## Link to API endpoints

For `development` environment, prepend `http://localhost:{PORT}` or `http://127.0.0.1:{PORT}` to the route. The default value for `{PORT}` should be `3000`.
For `production` environment, prepend `awslink` to the route.

| #   | Method | Route                         | Description                                                       |
| :-- | :----- | :---------------------------- | :---------------------------------------------------------------- |
| 1   | POST   | /api/register                 | Register one or more students to a specified teacher              |
| 2   | GET    | /api/commonstudents           | Retrieve students who are registered to all of the given teachers |
| 3   | POST   | /api/suspend                  | Suspend a specified student                                       |
| 4   | POST   | /api/retrievefornotifications | Retrieve a list of students who can receive a given notification  |

---

---

## User stories given

### 1. As a teacher, I want to register one or more students to a specified teacher.

A teacher can register multiple students. A student can also be registered to multiple teachers.

-   Endpoint: `POST /api/register`
-   Headers: `Content-Type: application/json`
-   Success response status: HTTP 204
-   Request body example:

```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

### 2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).

-   Endpoint: `GET /api/commonstudents`
-   Success response status: HTTP 200
-   Request example 1: `GET /api/commonstudents?teacher=teacherken%40gmail.com`
-   Success response body 1:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
```

-   Request example 2: `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
-   Success response body 2:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com"
    ]
}
```

### 3. As a teacher, I want to suspend a specified student.

-   Endpoint: `POST /api/suspend`
-   Headers: `Content-Type: application/json`
-   Success response status: HTTP 204
-   Request body example:

```
{
  "student" : "studentmary@gmail.com"
}
```

### 4. As a teacher, I want to retrieve a list of students who can receive a given notification.

A notification consists of:

-   the teacher who is sending the notification, and
-   the text of the notification itself.

To receive notifications from e.g. 'teacherken@gmail.com', a student:

-   MUST NOT be suspended,
-   AND MUST fulfill _AT LEAST ONE_ of the following:
    1. is registered with “teacherken@gmail.com"
    2. has been @mentioned in the notification

The list of students retrieved should not contain any duplicates/repetitions.

-   Endpoint: `POST /api/retrievefornotifications`
-   Headers: `Content-Type: application/json`
-   Success response status: HTTP 200
-   Request body example 1:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

-   Success response body 1:

```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
}
```

In the example above, studentagnes@gmail.com and studentmiche@gmail.com can receive the notification from teacherken@gmail.com, regardless whether they are registered to him, because they are @mentioned in the notification text. studentbob@gmail.com however, has to be registered to teacherken@gmail.com.

-   Request body example 2:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
```

-   Success response body 2:

```
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]
}
```

## Error Responses

For all the above API endpoints, error responses should:

-   have an appropriate HTTP response code
-   have a JSON response body containing a meaningful error message:

```
{ "message": "Some meaningful error message" }
```
