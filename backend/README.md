# Social app

Social media app that let an user post and comment, follow other users, view a personalized feed and like other user's posts and comments.

## Requirements

MongoDB

## Install
```
$ git clone https://github.com/tnrdd/social-app.git`
$ cd social-app
```
### Backend
```
$ cd backend
$ npm install
```
Create a file named `.env` and fill it out with your info.
```
# Set the enviroment to development or production
NODE_ENV =

# The port on wich you want to run your server, e.g. 3000
PORT =

# MongoDB url
DB = 

# The secret key for the json web token authentication, should be a random string
JWT_SECRET =

# The number of round to generate the salt for bcrypt, e.g. 8
SALT =
```
#### Run

`node app.js`

### Frontend
```
$ cd frontend
$ npm install
$ npm run build
```
