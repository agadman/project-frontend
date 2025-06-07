# Frontend - Slutprojekt - Backend-baserad webbutveckling
Detta är frontend-delen för mitt slutprojekt inom kursen Backend-baserad webbutveckling vid Mittuniversitetet. Projektet är byggt med Vite, vanlig JavaScript, HTML och CSS. Frontend kommunicerar med ett REST-API för att visa och hantera menyinnehåll.

URL: https://project-frontend-4niq.onrender.com/

Webbtjänst/API repo: https://github.com/agadman/end-project.git

## Kör projektet
Installera beroenden: npm install
Starta utvecklingsserver: npm run dev
Bygg för produktion: npm run build

## Inloggning och Autentisering
Det går endast att logga in i användargränsnittet med en befintlig användare.
- Inloggningen skickar användarnamn och lösenord till `/api/login`.
- Vid lyckad inloggning sparas JWT-token i `localStorage`.
- `admin.html` kräver token för att kunna lägga till, ändra eller ta bort menyobjekt.