# CampusGo Auth API Reference

How to call the auth endpoints from **Postman** or **Android**. All auth endpoints use the `throttle:api` rate limit.

---

## Base URL

| Where you're calling from | Base URL |
|---------------------------|----------|
| **Postman (same machine as Laravel)** | `http://localhost:8000/api` |
| **Android emulator** (app on emulator, Laravel on PC) | `http://10.0.2.2:8000/api` |
| **Android physical device** (same Wi‑Fi as PC) | `http://YOUR_PC_IP:8000/api` (e.g. `http://192.168.1.5:8000/api`) |
| **Production** | `https://your-domain.com/api` |

Make sure the Laravel server is running: `php artisan serve` (default port 8000).

---

## Bearer token (important)

After **login** or **register**, the server returns a **token**. Use it for **protected** endpoints.

- **Protected endpoints:** `GET /api/user`, `POST /api/logout`
- **How to send the token:** Add this header to every request to those endpoints:
  - **Header name:** `Authorization`
  - **Header value:** `Bearer <paste the token here>` (word “Bearer”, space, then the token)

**Example:** If the response was `"token": "1|abc123xyz..."`, then:
- In **Postman:** Auth tab → Type: Bearer Token → paste `1|abc123xyz...` (or add header `Authorization` = `Bearer 1|abc123xyz...`).
- In **Android:** Add header `Authorization: Bearer 1|abc123xyz...` (or use an OkHttp interceptor that adds it from stored token).

Without this header (or with a wrong/expired token), you get **401 Unauthorized**.

---

## 1. Login

**Endpoint:** `POST /api/login`  
**Auth required:** No  
**URL in Postman:** `http://localhost:8000/api/login`

### Request

- **Method:** POST  
- **Headers:** `Content-Type: application/json`  
- **Body (raw JSON):**

```json
{
  "username": "johndoe",
  "password": "your_password"
}
```

### Success (200)

```json
{
  "token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Save the `token` value** — you need it for `/api/user` and `/api/logout`.

### Errors

- **422** – Missing/invalid fields or wrong credentials. Body: `{ "errors": { "username": [ "These credentials do not match our records." ] } }`.

---

## 2. Register

**Endpoint:** `POST /api/register`  
**Auth required:** No  
**URL in Postman:** `http://localhost:8000/api/register`

Only **registered students** can register. The student must already exist in the campus `students` table (same `student_id`, `first_name`, `last_name`, `birthday`). The server sets `user.name` from `first_name` + `" "` + `last_name`.

### Request

- **Method:** POST  
- **Headers:** `Content-Type: application/json`  
- **Body (raw JSON):** All fields below are required.

```json
{
  "email": "jane@example.com",
  "username": "janedoe",
  "password": "mypassword123",
  "password_confirmation": "mypassword123",
  "student_id": "22-000951",
  "last_name": "Doe",
  "first_name": "Jane",
  "birthday": "2004-01-15"
}
```

| Field | Type | Description |
|-------|------|-------------|
| email | string | Unique; used for account. |
| username | string | Unique; used to log in. |
| password | string | Min 8 characters. |
| password_confirmation | string | Must match `password`. |
| student_id | string | Must exist in campus records and not yet linked. |
| last_name | string | Must match student record. |
| first_name | string | Must match student record. |
| birthday | string | Date only: `Y-m-d` (e.g. `2004-01-15`). |

### Success (201)

```json
{
  "token": "2|xyz789...",
  "token_type": "Bearer",
  "user": {
    "id": 2,
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@example.com"
  }
}
```

**Save the `token`** for `/api/user` and `/api/logout`.

### Errors (422)

| Situation | Error key | Example message |
|-----------|-----------|-----------------|
| Missing/invalid fields | field name | Laravel validation messages |
| Unknown student_id | student_id | Only registered students can create an account. Please provide a valid student ID. |
| Student already has account | student_id | This student ID is already linked to an account. Please log in instead. |
| Name or birthday mismatch | student_id | The student ID, last name, first name, or birthday does not match our records. Only registered students can create an account. |
| Email or username taken | email / username | Laravel uniqueness messages |

Response shape: `{ "message": "...", "errors": { "field": ["message"] } }`.

---

## 3. Get current user (protected)

**Endpoint:** `GET /api/user`  
**Auth required:** Yes — Bearer token  
**URL in Postman:** `http://localhost:8000/api/user`

### Request

- **Method:** GET  
- **Headers:**
  - `Authorization: Bearer <token>` (use the token from login or register)
  - `Accept: application/json` (optional; API is set to return JSON)

In **Postman:** Auth → Type: Bearer Token → paste the token. Or add header:  
`Authorization` = `Bearer 1|abc123...`

### Success (200)

```json
{
  "id": 1,
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com"
}
```

### Errors

- **401** – Missing or invalid token.

---

## 4. Logout (protected)

**Endpoint:** `POST /api/logout`  
**Auth required:** Yes — Bearer token  
**URL in Postman:** `http://localhost:8000/api/logout`

Revokes the current token so it can no longer be used.

### Request

- **Method:** POST  
- **Headers:** `Authorization: Bearer <token>` (same as for GET /api/user)

No body needed. In **Postman:** set Auth to Bearer Token and paste the token.

### Success (200)

```json
{
  "message": "Logged out"
}
```

After logout, that token is invalid. Do not send it again; for next login/register you will get a new token.

### Errors

- **401** – Missing or invalid token.

---

## Quick reference

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | /api/login | No | `{"username":"...","password":"..."}` |
| POST | /api/register | No | See full JSON above (email, username, password, password_confirmation, student_id, last_name, first_name, birthday) |
| GET | /api/user | Bearer token | — |
| POST | /api/logout | Bearer token | — |

**Postman testing order:**  
1. POST `/api/login` or `/api/register` → copy `token` from response.  
2. For GET `/api/user` and POST `/api/logout`: set **Authorization** to **Bearer Token** and paste the token.

**Android:** Use the same URLs (with base URL for emulator/device), add `Authorization: Bearer <token>` for `/user` and `/logout`. See **docs/ANDROID_AUTH_API_GUIDE.md** for Retrofit/Kotlin examples.
