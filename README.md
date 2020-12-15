# Teacher-student-api Assessment Submission

## Stack details

-   App layer:
    -   Backend: [Node.js](https://nodejs.org/en/download/) + [Express](http://expressjs.com/)
    -   Validator library: [express-validator](https://express-validator.github.io/)
-   Database layer: [MySQL](https://dev.mysql.com/downloads/mysql/)
-   Test Suite: [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/)

The production environment is hosted on AWS using an EC2 instance and RDS(MySQL). Note that it is hosted on AWS free tier and the service will probably have an outage when subject to load testing.

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
   Contents of `.env.example` are shown below. Remember to replace the values of DB_USER and DB_PASSWORD:

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
8. You can now proceed to use the endpoints defined in the next section!

## Link to API endpoints

For the `development` environment, prepend `http://localhost:{PORT}` or `http://127.0.0.1:{PORT}` to the route. The default value for `{PORT}` should be `3000`.

For the `production` environment, prepend `http://ec2-13-212-44-191.ap-southeast-1.compute.amazonaws.com:3000` to the route (e.g. `http://ec2-13-212-44-191.ap-southeast-1.compute.amazonaws.com:3000/api/register`)

| #   | Method | Route                         | Description                                                      |
| :-- | :----- | :---------------------------- | :--------------------------------------------------------------- |
| 1   | POST   | /api/register                 | Register one/multiple students to a single specified teacher     |
| 2   | GET    | /api/commonstudents           | Retrieve students who are registered to all teachers specified   |
| 3   | POST   | /api/suspend                  | Suspend a specified student                                      |
| 4   | POST   | /api/retrievefornotifications | Retrieve a list of students who can receive a given notification |

---

<br>
<br>
<br>

**1. Register one/multiple students to a single specified teacher**

---

-   **Brief Description**

    This endpoint can be used to a single teacher to multiple students.  
    If the teacher email does not exist in the database, it will be created. Similarly, if student emails provided that do not exist in the database will be created. Entities (teacher/student) that already exist will not be created. The students are then associated with the teacher after the creations of the non-existent entities.

-   **URL**

    `/api/register`

-   **Method:**

    `POST`

-   **Headers**

    `Content-Type: application/json`

-   **Data Params**

    ```json
    {
        "teacher": "teacherken@gmail.com",
        "students": ["studentjon@gmail.com", "studenthon@gmail.com"]
    }
    ```

-   **Success Response:**

    -   **Code:** `204 Created`<br />

-   **Error Response:**

    -   **Code:** `400 Bad Request`<br />
        **Content:** `{ message : <error message> }`

<br>

**2. Retrieve students who are registered to all teachers specified**

---

-   **Brief Description**

    This endpoint is used to get the students who are under all teachers listed in the the parameters.  
    Students who are marked as suspended will not show up in the returned list of students.  
    If there are no common students, the endpoint will still return `200 OK`, with an empty array in the `students` field.

-   **URL**

    `/api/commonstudents`

-   **Method:**

    `GET`

*   **Query Params**

    `teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com`

*   **Success Response:**

    -   **Code:** `200 OK`<br />
    -   **Body:**

        ```json
        {
            "students": ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
        }
        ```

*   **Error Response:**

    -   **Code:** `400 Bad Request`<br />
        **Content:** `{ message : <error message> }`

    <br>

**3. Suspend a specified student**

---

-   **Brief Description**

    This endpoint can be used to update a single student's status to be suspended.
    A successful suspension of a student using the endpoint returns `204 CREATED` without any content.

    If the student email does not exist in the database, a `404 NOT FOUND` error will be returned.  
    If you try to suspend a student that is already suspended, the endpoint returns `304 NOT MODIFIED`.

-   **URL**

    `/api/suspend`

-   **Method:**

    `POST`

-   **Headers**

    `Content-Type: application/json`

-   **Data Params**

    ```json
    {
        "student": "studentmary@gmail.com"
    }
    ```

-   **Success Response:**

    -   **Code:** `204 Created`<br />

-   **Error Response:**

    -   **Code:** `400 Bad Request`<br />
        **Content:** `{ message : <error message> }`
    -   **Code:** `304 Not Modified`<br />
    -   **Code:** `404 Not Found`<br />
        **Content:** `{ message : <error message> }`

<br>

**4. Retrieve list of students that can receive notifications**

---

-   **Brief Description**

    This endpoint can be used to check the students that can receive a given notification by a teacher.

    Students who are suspended will not be included in the list as they should not receive any notifications.

    If a non-existent student is mentioned, the email will not be included in the `recipients` list and the endpoint does not return any error.

-   **URL**

    `/api/retrievefornotifications`

-   **Method:**

    `POST`

-   **Headers**

    `Content-Type: application/json`

-   **Data Params**

    ```json
    {
        "teacher": "teacherken@gmail.com",
        "notification": "Hey everybody"
    }
    ```

-   **Success Response:**

    -   **Code:** `200 OK`<br />
        **Content:**
        ```json
        {
            "recipients": ["studentbob@gmail.com", "studentagnes@gmail.com", "studentmiche@gmail.com"]
        }
        ```

*   **Error Response:**

    -   **Code:** `400 Bad Request`<br />
        **Content:** `{ message : <error message> }`

    <br>

## Contributors

---

Clarkson Chang (github.com/clarksonchang)
