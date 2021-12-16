# Create user sign-up and login

Use bcrypt to allow users to sign up and log in via an API.

## Understand the functionality of bcrypt

- use [these notes](https://onespace.netlify.app/howtos?id=444) to understand how you can use [bcrypt](https://www.npmjs.com/package/bcrypt) to:
    - take a password and create a hash of it to save in the database
    - take a password and compare it to a hash in the database to see if the password is correct
    
## Create an API that allows users to sign up and log in

- use Node/Express/Mongoose to create an API with two endpoints:
    - `POST /signup`
        - receive login, password1 and password2 as payload (body)
            - look for login in database, if login found, then return a 409 (Conflict)
            - if password1 and password2 do not match, return a 403 (Forbidden: "the server understood the request but refuses to authorize it")
        - use bcrypt to create a hash of the password
        - save login and hash as a document in a collection `users` in an app called `testapp003`
    - `POST /login`
        - receive login and password as payload (body)
        - retreive (find) the document for that login from the database
        - use bcrypt to check if the password produces the same hash as in the database
        - if no, then return a 401 (Unauthorized)
        - if yes, then return a 200 (OK)
- for code guidance in creating an API which accesses a MongoDB with Mongoose, see these instructions: [Setup M(V)C API for MongoDB collection with subdocument structure](https://onespace.netlify.app/howtos?id=440)

## 🥇 BONUS: Build a frontend which uses the above API

- use create-react-app
- make two forms
    - Signup form
        - fields: Login, Password, Confirm Password
        - validation:
            - Login: required, 5 or more characters
            - Password1: required, 8 or more characters, contains both numbers and letters
            - Password2: required, 8 or more characters, contains both numbers and letters, matches Password1
        - if response 403, then inform user that it was unsuccessful and try again
            - (frontend validation should theoretically prevent this)
        - if response 200, then inform user that they successfully created a user
    - Login form
        - fields: Login, Password
        - validation
            - Login: required
            - Password: required
        - if 401, then inform user that their login or password was incorrect
        - if 200, then inform user that they successfully logged in 

## 💪 CHALLENGE: Create ability for admin user to delete users

- use your frontend to create a user with the login `admin`
- on the backend API, create an endpoint `DELETE /deleteuser`
    - payload (body): adminLogin, adminPassword, userLoginToDelete
    - if admin login/password are not correct, then respond with 401 (Unauthorized)
    - if user login to delete does not exist, then respond with 404 (Not Found)
    - if user was found and deleted, then respond with 200 (OK)
- on the frontend, create a new form:
    - fields: Admin Login, Admin Password, User Login to Delete
    - inform the user appropriately based on the server response
