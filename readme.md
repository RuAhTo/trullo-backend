# TrulloDB API-dokumentation

## Översikt

TrulloDB är ett RESTful API för att hantera användare, uppgifter och projekt med rollbaserad åtkomstkontroll.

**Bas-URL:** `http://localhost:3000/trullodb`

---

## Innehållsförteckning

1. [Installation](#installation)
2. [Autentisering](#autentisering)
3. [Användarrutter](#användarrutter)
4. [Uppgiftsrutter](#uppgiftsrutter)

---

## Installation

### Kör i utvecklingsläge
```bash
npm run dev
```

### Miljövariabler

Skapa en `.env`-fil i projektets rotkatalog med följande innehåll:

```env
DATABASE_URL=postgresql://trullodb_zyzr_user:KgDLM2c62nNffDWFoQfOKMxjnkiQ4DnD@dpg-d0firkidbo4c73agnj90-a.frankfurt-postgres.render.com/trullodb_zyzr
JWT_SECRET=your_jwt_secret
```

---

## Autentisering

### POST `/auth/login`

Autentisera en användare och få en JWT-token.

- **Begäran:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- **Svar:**

```json
{
  "token": "jwt_token_here",
  "id": 1
}
```

- **Felmeddelanden:**
  - `401 Unauthorized`: Ogiltiga inloggningsuppgifter
  - `500 Internal Server Error`: Oväntat fel

### Använda token

Lägg till följande header i skyddade förfrågningar:

```
Authorization: Bearer <token>
```

---

## Användarrutter

### GET `/users`

- **Beskrivning:** Hämta alla användare.
- **Autentisering:** Ej nödvändig

---

### GET `/user/:id`

- **Beskrivning:** Hämta en specifik användare med ID.
- **Autentisering:** Ej nödvändig
- **Parametrar:**
  - `id` — Användar-ID

---

### POST `/users`

- **Beskrivning:** Skapa en ny användare.
- **Autentisering:** Ej nödvändig
- **Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

- **Svar:**

```json
{
  "id": 1,
  "message": "Användare skapad!",
  "username": "johndoe"
}
```

---

### PUT `/users`

- **Beskrivning:** Uppdatera inloggad användares information.
- **Autentisering:** Krävs

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

- **Beskrivning:** Ta bort inloggad användare.
- **Autentisering:** Krävs

- **Svar:**

```json
{
  "message": "Användare borttagen!",
  "user": { ... }
}
```

---

## Uppgiftsrutter

### GET `/tasks`

- **Beskrivning:** Hämta alla uppgifter.
- **Autentisering:** Ej nödvändig

---

### GET `/tasks/:id`

- **Beskrivning:** Hämta en uppgift med ID.
- **Autentisering:** Ej nödvändig

---

### GET `/users/tasks`

- **Beskrivning:** Hämta uppgifter skapade av inloggad användare.
- **Autentisering:** Krävs

---

### GET `/project/:id/tasks`

- **Beskrivning:** Hämta uppgifter kopplade till ett projekt-ID.
- **Autentisering:** Krävs

---

### POST `/tasks`

- **Beskrivning:** Skapa en ny uppgift.
- **Autentisering:** Rekommenderas

- **Body:**

```json
{
  "title": "Uppgiftstitel",
  "description": "Detaljer om uppgiften",
  "status": "TO_DO",
  "authorId": 1
}
```

- **Svar:**

```json
{
  "id": 2,
  "message": "Uppgift skapad!",
  "title": "Uppgiftstitel",
  "status": "TO_DO",
  "authorId": 1
}
```

---

## Noteringar

- Tillgängliga statusalternativ: `TO_DO`, `IN_PROGRESS`, `BLOCKED`, `DONE`
- Projektroller: `USER`, `ADMIN`
- Skyddade rutter kräver en giltig JWT-token

---