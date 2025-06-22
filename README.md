# Brainly-and-End-Application

This is a full-stack application written in TypeScript using Express, Mongoose, and JWT for authentication.

## Features

* User registration and login
* Content creation and retrieval
* Content deletion
* User authentication and authorization
* JWT-based authentication
* MongoDB database

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a MongoDB database and update the `MONGO_URL` environment variable in the `.env` file
4. Start the server with `npm start`
5. Open a web browser and navigate to `http://localhost:3000`

## Endpoints

### User

* `POST /api/v1/signup`: Register a new user
	+ Body: `username`, `password`
	+ Response: `message`, `token`, `user`
* `POST /api/v1/login`: Login an existing user
	+ Body: `username`, `password`
	+ Response: `message`, `token`, `user`

### Content

* `POST /api/v1/content`: Create a new content
	+ Body: `link`, `title`, `type`, `content`, `tag`
	+ Response: `message`, `content`
* `GET /api/v1/content`: Retrieve all content
	+ Response: `message`, `contents`
* `DELETE /api/v1/content/:id`: Delete a content
	+ Path: `id`
	+ Response: `message`

### Brain

* `POST /api/v1/brain/share`: Share a content
	+ Body: `link`
	+ Response: `message`, `link`
* `POST /api/v1/brain/:shareLink`: Get a shared content
	+ Path: `shareLink`
	+ Response: `message`, `content`

## Environment Variables

* `MONGO_URL`: The MongoDB database URL
* `JWT_PASSWORD`: The secret key for JWT authentication
* `PORT`: The port number for the server

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

