# Tankad Tacos API

Detta repository innehåller kod för en webbtjänst byggd med Node.js, Express och MongoDB. API:et är skapat för en fiktiv taco truck, Tankad Tacos, och innehåller funktionalitet för autentisering med registrering, inloggning och skyddade routes.

Vid inloggning skapas en JWT-token som används för att komma åt skyddad admin-data. Lösenord hashats med bcrypt innan de sparas i databasen.

https://DIN-BACKEND-URL.onrender.com/

## Installation och databas

API:et använder en MongoDB-databas via MongoDB Atlas. För att hantera databasen används Mongoose.

Klona ner källkodsfilerna och kör följande kommando för att installera nödvändiga npm-paket:

```bash
npm install
```

Skapa sedan en `.env`-fil i projektets rotmapp och lägg till följande variabler:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/TankadTacos?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Starta projektet lokalt med:

```bash
npm run dev
```

eller

```bash
npm start
```

Databasen skapas och fylls med data när nya användare eller menyobjekt läggs till via API:et.

## Datamodeller

### User

Varje användarkonto innehåller följande fält:

| Fält | Datatyp | Beskrivning |
|---|---|---|
| username | String | Användarnamn |
| email | String | Användarens e-postadress |
| password | String | Hashat lösenord |
| account_created | Date | Datum då kontot skapades |

### MenuItem

Varje menyobjekt innehåller följande fält:

| Fält | Datatyp | Beskrivning |
|---|---|---|
| name | String | Namn på maträtten eller drycken |
| category | String | Kategori, till exempel Mat eller Dryck |
| description | String | Beskrivning av menyobjektet |
| fillings | Array | Lista med fyllningar eller alternativ |
| price | Number | Pris i kronor |

## Användning

Nedan beskrivs hur API:et kan användas:

| Metod | Ändpunkt | Skyddad | Beskrivning |
|---|---|---|---|
| GET | `/` | Nej | Testar att API:et är igång |
| POST | `/api/auth/register` | Nej | Skapar ett nytt användarkonto |
| POST | `/api/auth/login` | Nej | Loggar in användare och returnerar JWT-token |
| GET | `/api/admin/dashboard` | Ja | Hämtar skyddad admin-data och meny från databasen |
| POST | `/api/admin/menu` | Ja | Lägger till ett nytt menyobjekt i databasen |

Skyddade routes kräver att en giltig JWT-token skickas med i anropet:

```bash
Authorization: Bearer DIN_TOKEN_HÄR
```

## JSON-struktur för registrering

Ett nytt användarkonto skickas som JSON med följande struktur:

```json
{
  "username": "admin",
  "email": "admin@tankadtacos.se",
  "password": "password123"
}
```

## JSON-struktur för inloggning

Vid inloggning skickas användarnamn och lösenord:

```json
{
  "username": "admin",
  "password": "password123"
}
```

Vid lyckad inloggning returneras en JWT-token:

```json
{
  "message": "Inloggning lyckades.",
  "token": "JWT_TOKEN_HÄR",
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@tankadtacos.se"
  }
}
```

## JSON-struktur för menyobjekt

Ett menyobjekt skickas som JSON med följande struktur:

```json
{
  "name": "Tacos",
  "category": "Mat",
  "description": "Mjuka tacos med valfri fyllning.",
  "fillings": ["Chicken", "Asada", "Al Pastor", "Veggie mince", "Fajita veggies"],
  "price": 95
}
```

## Skyddad admin-route

Exempel på skyddad route:

```bash
GET /api/admin/dashboard
```

Denna route kräver en giltig JWT-token. Om ingen token skickas returneras ett felmeddelande. Om token är giltig returneras skyddad admin-data och menyobjekt från databasen.

## Tekniker

Projektet är byggt med:

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- CORS
- dotenv
- bcryptjs
- jsonwebtoken
- nodemon