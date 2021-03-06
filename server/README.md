# Backend Technical Challenge

### SETUP

The language used was JavaScript and the app was built in NodeJS, which will be required to properly run the application.

To replicate the dev environment, please use MongoDB, which was the home of the database during development ("christmas-collection"). :=) The port during development was 4000.

Before running, create a `server/.env` file, with

`MONGODB_URI= "mongodb://localhost/christmas-collection"`
`PORT = 4000`

### COMMANDS

To initialize the application

`$cd server`
`$npm install`
`$node bin/seeds.js` (to seed the database)
`$npm run dev`

Several packages were used to enable the application to run as intended. Some of the very important ones were:

- `express` (for routing)
- `passport` (for authentication)
- `bcrypt` (for hashing passwords)
- `chai`, `mocha`, `superagent` and `supertest` (for unit testing)

The server will be available on `http://localhost:4000/`

API calls can be directed through Postman via:

- `POST http://localhost:4000/api/signup`
- `POST http://localhost:4000/api/login`
- `POST http://localhost:4000/api/logout`
- `GET http://localhost:4000/api/articles` (retrieve all blog entries)
- `GET http://localhost:4000/api/articles/:id` (retrieve a single blog entry)
- `POST http://localhost:4000/api/articles` (create a new blog post)
- `PATCH http://localhost:4000/api/articles/:id` (update the elements of a blog post)
- `DELETE http://localhost:4000/api/articles/:id` (update the elements of a blog post)

### NOTES

- The database will be seeded with ONE user with the following credentials:

* `username: kash`
* `password: kash`
* `role: "admin"`

- All other new users will be added with the default role of "user".

- Create (`/signup`) new user with any username and password once in Postman. Login (`/login`) with this user to test routes.

- Per instructions, only users with the role "admin" can create or update posts. The user `kash` can always be used to test these permissions. All users, once logged in, can delete posts. Anyone can read posts (whether or not logged in).

- The database will be seeded with 3 blog posts.

- Authentication is performed via the passport package. It was helpful to establish whether a user was logged in or not, and was also useful for determining whether a user's role allowed permissions or not.

- Testing was done through the use of combination of Mocha, Chai, SuperAgent and SuperTest packages. Tests are located in `test/api.test.js` and can be initalized from the terminal with the command `mocha` or `npm run test`.
