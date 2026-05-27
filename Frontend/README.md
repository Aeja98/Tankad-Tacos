# Tankad Tacos Webbplats

https://DIN-FRONTEND-URL.onrender.com/

En fristående webbplats skapad för den fiktiva taco trucken Tankad Tacos. Webbplatsen använder Fetch API för att kommunicera med en REST-baserad webbtjänst där användare kan registrera konto, logga in och komma åt skyddad admin-data.

Backend/API:
https://DIN-BACKEND-URL.onrender.com/

## Funktioner

- Registrera nytt användarkonto via formulär
- Logga in med användarnamn och lösenord
- Spara JWT-token i sessionStorage vid lyckad inloggning
- Skicka JWT-token i Authorization-header vid anrop till skyddad route
- Skydda admin-sidan så att den endast visas för inloggade användare
- Hämta och visa skyddad admin-data från backend
- Visa menyobjekt från MongoDB på admin-sidan
- Logga ut genom att radera token från sessionStorage
- Visa felmeddelanden vid felaktig inloggning eller saknad behörighet
- Hämta och skicka data med Fetch API

## Tekniker

Projektet är byggt med:

- HTML
- SCSS
- JavaScript
- Fetch API
- Vite
- sessionStorage
- JWT

## Om webbplatsen

Tankad Tacos är en fiktiv taco truck i Stockholm som serverar tacos, nachos, quesadillas och dryck sent på kvällen nära stadens nattliv.

Webbplatsen fungerar som ett enkelt inloggningssystem för personal. Efter inloggning får användaren tillgång till en skyddad adminpanel där data hämtas från backend via en skyddad route.

## Menyobjekt

Varje menyobjekt som visas i adminpanelen innehåller följande information:

- `_id` – unikt id för varje post från MongoDB
- `name` – namn på maträtten eller drycken
- `category` – kategori, till exempel Mat eller Dryck
- `description` – beskrivning av menyobjektet
- `fillings` – lista med fyllningar eller alternativ
- `price` – pris i kronor

## Sidor

Webbplatsen innehåller fyra undersidor:

- `index.html` – startsida med kort information om Tankad Tacos
- `register.html` – formulär för att registrera ett nytt användarkonto
- `login.html` – formulär för att logga in
- `dashboard.html` – skyddad adminpanel som kräver inloggning

## Filstruktur

```text
Autentisering-frontend/
├── src/
│   ├── js/
│   │   ├── main.js
│   │   ├── register.js
│   │   ├── login.js
│   │   └── dashboard.js
│   └── scss/
│       ├── _variables.scss
│       ├── _base.scss
│       ├── _layout.scss
│       ├── _forms.scss
│       └── main.scss
├── dashboard.html
├── index.html
├── login.html
├── register.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Om API:et

Webbplatsen är fristående från backend och använder Fetch API för att kommunicera med webbtjänsten. Backend är byggd med Node.js, Express och MongoDB Atlas och finns i ett separat repository.

Registrering och inloggning görs med POST-anrop till backend. Vid lyckad inloggning returneras en JWT-token som sparas i sessionStorage. Token skickas sedan med vid anrop till skyddade routes.

Exempel på skyddat anrop:

```js
fetch(`${API_URL}/api/admin/dashboard`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## Backend-routes som används

| Metod | Ändpunkt | Beskrivning |
|---|---|---|
| POST | `/api/auth/register` | Registrerar ett nytt användarkonto |
| POST | `/api/auth/login` | Loggar in användare och returnerar JWT-token |
| GET | `/api/admin/dashboard` | Hämtar skyddad admin-data och meny från databasen |
```