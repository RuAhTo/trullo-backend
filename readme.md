
# TrulloDB API Documentation

## Overview

TrulloDB is a RESTful API for managing users, tasks, and projects with role-based access control.

**Base URL:** `http://localhost:3000/trullodb`

---

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
3. [User Routes](#user-routes)
4. [Task Routes](#task-routes)

---

## Installation

### Run in Development
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root with:

```env
DATABASE_URL=postgresql://trullodb_zyzr_user:KgDLM2c62nNffDWFoQfOKMxjnkiQ4DnD@dpg-d0firkidbo4c73agnj90-a.frankfurt-postgres.render.com/trullodb_zyzr
JWT_SECRET=your_jwt_secret
```

---

## Authentication

### POST `/auth/login`

Authenticate a user and receive a JWT.

- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- **Response:**

```json
{
  "token": "jwt_token_here",
  "id": 1
}
```

- **Errors:**
  - `401 Unauthorized`: Invalid credentials
  - `500 Internal Server Error`: Unexpected error

### Using the Token

Add this header to authorized requests:

```
Authorization: Bearer <token>
```

---

## User Routes

### GET `/users`

- **Description:** Retrieve all users.
- **Authentication:** Not required

---

### GET `/user/:id`

- **Description:** Get a specific user by ID.
- **Authentication:** Not required
- **Params:**
  - `id` — User ID

---

### POST `/users`

- **Description:** Create a new user.
- **Authentication:** Not required
- **Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

- **Response:**

```json
{
  "id": 1,
  "message": "User created!",
  "username": "johndoe"
}
```

---

### PUT `/users`

- **Description:** Update authenticated user’s data.
- **Authentication:** Required

- **Body:**

```json
{
  "username": "newusername",
  "email": "new@example.com",
  "password": "newpassword",
  "name": "New Name"
}
```

---

### DELETE `/users`

- **Description:** Delete authenticated user.
- **Authentication:** Required

- **Response:**

```json
{
  "message": "User deleted!",
  "user": { ... }
}
```

---

## Task Routes

### GET `/tasks`

- **Description:** Get all tasks.
- **Authentication:** Not required

---

### GET `/tasks/:id`

- **Description:** Get task by ID.
- **Authentication:** Not required

---

### GET `/users/tasks`

- **Description:** Get tasks created by the authenticated user.
- **Authentication:** Required

---

### GET `/project/:id/tasks`

- **Description:** Get tasks by project ID.
- **Authentication:** Required

---

### POST `/tasks`

- **Description:** Create a new task.
- **Authentication:** Recommended

- **Body:**

```json
{
  "title": "Task Title",
  "description": "Details about task",
  "status": "TO_DO",
  "authorId": 1
}
```

- **Response:**

```json
{
  "id": 2,
  "message": "Todo created!",
  "title": "Task Title",
  "status": "TO_DO",
  "authorId": 1
}
```

---

## Notes

- Status options: `TO_DO`, `IN_PROGRESS`, `BLOCKED`, `DONE`
- Project roles: `USER`, `ADMIN`
- Protected routes require a valid JWT token

---
