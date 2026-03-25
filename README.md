# news-explorer-api

REST API for user registration, authentication and saving news articles. This backend is built with Node.js, Express, and MongoDB, and is intended to support a News Explorer frontend application.

## Features

- User registration with hashed passwords
- User login with JWT-based authentication
- Protected route for retrieving the current user profile
- Create, list, and delete saved articles
- Request validation with `celebrate` and `Joi`
- MongoDB data models with Mongoose validation
- Centralized error handling
- Request and error logging with Winston
- Basic rate limiting for API protection
- CORS enabled

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose

## Running project locally

### Prerequisites

- Node.js
- MongoDB

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and define:

```env
PORT=3000
NODE_ENV=development
MONGO_BASE=mongodb://your-production-host/newsdb
JWT_SECRET=your-production-jwt-secret
```

Notes:

- In development mode, the app uses the local database `mongodb://localhost:27017/newsdb`.
- In production mode, the app uses `MONGO_BASE`.
- In development mode, a hardcoded fallback JWT secret is used if `NODE_ENV` is not `production`.

### Run the Server

```bash
npm start
```

The server starts on the port defined by `PORT`, or `3000` by default.

## API Endpoints

### Public Routes

#### `POST /signup`

Creates a new user.

Request body:

```json
{
  "name": "Masha",
  "email": "masha@example.com",
  "password": "password"
}
```

Success response:

```json
{
  "name": "Masha",
  "email": "masha@example.com"
}
```

#### `POST /signin`

Authenticates a user and returns a JWT token.

Request body:

```json
{
  "email": "masha@example.com",
  "password": "password"
}
```

Success response:

```json
{
  "token": "your-jwt-token"
}
```

### Protected Routes

All routes below require an `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

#### `GET /users/me`

Returns the currently authenticated user.

#### `GET /articles`

Returns all articles saved by the current user.

#### `POST /articles`

Creates a saved article for the current user.

Request body:

```json
{
  "keyword": "technology",
  "title": "Space shuttle",
  "text": "article summary",
  "date": "2022-03-25",
  "source": "Example News",
  "link": "https://example.com/article",
  "image": "https://example.com/image.jpg"
}
```

#### `DELETE /articles/:articleId`

Deletes an article by ID. A user can delete only their own saved articles.
