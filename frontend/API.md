# Documentation API - Project Matcha

**Base URL** : `https://localhost:8443/api`

## Summary
- [Authentication](#authentication)
- [Profile](#profile)

---

> [!IMPORTANT]
> ** 401 Unauthorized **: All requests with credentials can return a response with this status code.
#### Status code error (401)
  - **CODE** : `UNAUTHORIZED` or `TOKEN_EXPIRED`

> [!IMPORTANT]
> ** 500 Internal server error **: All requests can return a response with this status code.  
#### Status code error (500)
  - **CODE** : `INTERNAL_ERROR`


## Authentication

### `POST /auth/login`
*User login*

#### Request
- Credentials : `False`

- **Body** :
```json
{
  "username": "string",
  "password": "string"
}
```

#### Response

1. **OK** :
  - Status code : `200`
  - Cookies : `Access and Refresh token`

- **Body** :
```json
{
  "id": "number",
  "username": "string",
  "isComplete": "boolean",
  "profileImage": "string"
}
```

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (400)
  - **CODE** : `INVALID_FORMAT`
    > *Info :* Invalid input or inputs

#### Status code error (401)
  - **CODE** : `INVALID_CREDENTIALS`
    > *Info :* Some of the input are incorrect

#### Status code error (403)
  - **CODE** : `EMAIL_NOT_VERIFIED`
    > *Info :* Email not verified

---

### `POST /auth/logout`
*User logout*

#### Request

- Body : `No body`
- Credentials : `True`

#### Response

1. **OK** :
  - Status code : `204`
  - Body : `No body`

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (401)
  - **CODE** : `UNAUTHORIZED`
    > *Info :* Missing credentials

---

### `POST /auth/register`
*Account creation*

#### Request
- Credentials : `False`

- **Body** :
```json
{
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "birthday": "string",
  "password": "string"
}
```

#### Response

1. **OK** :
  - Status code : `204`
  - Body : `No body`

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (400)
  - **CODE** : `INVALID_FORMAT`
    > *Info :*  Some of the input are incorrect

---

### `POST /auth/forgot-password`
*Send an email to recover your password*

#### Request
- Credentials : `False`

- **Body** :
```json
{
  "email": "string"
}
```

#### Response

1. **OK** :
  - Status code : `204`
  - Body : `No body`

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (400)
  - **CODE** : `INVALID_FORMAT`
    > *Info :*  Some of the input are incorrect

#### Status code error (404)
  - **CODE** : `NOT_FOUND`
    > *Info :* Email not found

---

### `POST /auth/reset-password`
*Let you change your forgotten password*

#### Request
- Credentials : `False`

- **Body** :
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### Response

1. **OK** :
  - Status code : `204`
  - Body : `No body`

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (400)
  - **CODE** : `INVALID_FORMAT`
    > *Info :*  Some of the input are incorrect

---

### `POST /auth/verify-email`
*Verify account creation*

#### Request
- Credentials : `False`
- URL token : `True`

- **Body** :
```json
{
  "token": "string"
}
```

#### Response

1. **OK** :
  - Status code : `204`
  - Body : `No body`

2. **!OK** :
 
```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (400)
  - **CODE** : `BAD_REQUEST`
    > *Info :*  Invalid token

#### Status code error (404)
  - **CODE** : `NOT_FOUND`
    > *Info :*  Token not found

#### Status code error (410)
  - **CODE** : `GONE`
    > *Info :*  Token expired

#### Status code error (409)
  - **CODE** : `CONFLIT`
    > *Info :*  Email already validated

---

## Profile

### `GET /users/:userId`
*Get user profile informations*

#### Request
  - Credentials : `True`
  - Body : `No body`

#### Response

1. **OK** :
  - Status code : `200`

- **Body** :
  > *Info :*  Base json structure
```json
{
  "id": "number",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "biography": "string | null",
  "birthdayDate": "Date",
  "fameRate": "number",
  "interests": "Array[{id: number, label: string}]",
  "gender": "string",
  "city": "string",
}
```

#### Add this to base json structure if it is not the profile of the logged-in user 
```json
{
  "lastSeen": "Date"
}
```

#### Add this to base json structure if it is the profile of the logged-in user
```json
{
  "email": "string",
  "address": "string",
  "lat": "number",
  "lon": "number",
  "sex_pref": "string" 
}
```

2. **!OK** :

```json
{
  "code": "string",
  "message": "string" 
}
```

#### Status code error (404)
  - **CODE** : `NOT_FOUND`
    > *Info :*  User not found

---

### `GET /users/:userId/images`
*Get images of the user profile*

#### Request
  - Credentials : `True`
  - Body : `No body`

#### Response

1. **OK** :
  - Status code : `200`

- **Body** :
```json
{
  "images": Array[{"id": "number", "filename": "string", "isPrimary": "boolean"}]
}
```

#### Status code error (404)
  - **CODE** : `NOT_FOUND`
    > *Info :*  User not found
