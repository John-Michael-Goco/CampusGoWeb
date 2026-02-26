# CampusGo Auth API Reference

Base path: `/api` (e.g. `http://localhost:8000/api`). All auth endpoints use the `throttle:api` rate limit.

---

## POST /api/login

Authenticate by username and password. Returns a Bearer token and user info.

**Request (JSON)**

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| username | string | Yes      | User's username |
| password | string | Yes      | User's password |

**Success (200)**

```json
{
  "token": "1|...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@example.com"
  }
}
```

**Errors**

- **422** – Validation (e.g. missing fields).
- **422** – Invalid credentials: `{ "errors": { "username": [ "These credentials do not match our records." ] } }`.

---

## POST /api/register

Create an account and return a Bearer token. **Only registered students** can register. The server verifies that `student_id` exists in the campus students table, is not yet linked to an account, and that `last_name`, `first_name`, and `birthday` match the student record.

**Request (JSON)**

| Field                 | Type   | Required | Description |
|-----------------------|--------|----------|-------------|
| email                 | string | Yes      | Unique email |
| username              | string | Yes      | Unique username |
| password              | string | Yes      | Min 8 characters |
| password_confirmation | string | Yes      | Must match password |
| student_id            | string | Yes      | Campus student ID (must exist and be unlinked) |
| last_name             | string | Yes      | Must match student record; used with first_name to set `user.name` |
| first_name            | string | Yes      | Must match student record; used with last_name to set `user.name` |
| birthday              | string | Yes      | Date in `Y-m-d` format (e.g. `2000-01-15`) |

The `user.name` column is set to `first_name + " " + last_name` (no separate `name` field in the request).

**Success (201)**

```json
{
  "token": "2|...",
  "token_type": "Bearer",
  "user": {
    "id": 2,
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@example.com"
  }
}
```

**Errors (422)**

| Condition | Error key  | Example message |
|-----------|------------|-----------------|
| Missing/invalid fields | field name | Laravel validation messages |
| Unknown student_id | student_id | Only registered students can create an account. Please provide a valid student ID. |
| Student already has account | student_id | This student ID is already linked to an account. Please log in instead. |
| Name or birthday does not match | student_id | The student ID, last name, first name, or birthday does not match our records. Only registered students can create an account. |
| Email or username already taken | email / username | Laravel uniqueness messages |

Response body shape: `{ "message": "...", "errors": { "field": ["message"] } }`.

---

## GET /api/user

Return the authenticated user. Requires Bearer token.

**Headers**

- `Authorization: Bearer <token>`

**Success (200)**

```json
{
  "id": 1,
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com"
}
```

**Errors**

- **401** – Missing or invalid token.

---

## POST /api/logout

Revoke the current access token. Requires Bearer token.

**Headers**

- `Authorization: Bearer <token>`

**Success (200)**

```json
{
  "message": "Logged out"
}
```

**Errors**

- **401** – Missing or invalid token.

---

## Summary

| Method | Endpoint       | Auth   | Description |
|--------|----------------|--------|-------------|
| POST   | /api/login     | No     | Login with username + password |
| POST   | /api/register  | No     | Register (student-only; requires student_id, last_name, first_name, birthday) |
| GET    | /api/user      | Bearer | Current user |
| POST   | /api/logout    | Bearer | Revoke token |

For Android-specific usage (Retrofit, Kotlin data classes, token storage), see **docs/ANDROID_AUTH_API_GUIDE.md**.
