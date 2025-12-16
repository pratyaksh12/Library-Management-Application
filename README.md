# Midnight Library 

## Tech Stack 🛠️

### Frontend
-   **Framework:** Next.js 15 (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS, Shadcn UI
-   **Animations:** Framer Motion
-   **State/API:** React Context, Axios

### Backend
-   **Framework:** .NET 8 Web API
-   **Database:** SQLite (Entity Framework Core)
-   **Auth:** JWT (JSON Web Tokens)
-   **Documentation:** Swagger UI

## Prerequisites
-   **Node.js** (v18+)
-   **.NET SDK** (v8.0+)

## Getting Started 

### 1. Backend Setup
Navigate to the backend directory and start the server:

```bash
cd LibraryApplicationManagement
dotnet restore
dotnet run
```
The API will start at `http://localhost:5125`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server:

```bash
cd library-frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## Key Features
-   **Authentication:** Secure Login & Register with JWT.
-   **Dashboard:** Browse books with 3D cover effects and search.
-   **Book Details:** Rich metadata and availability status.
-   **My Books:** Track active loans and view borrowing history.
-   **Admin:** Manage book inventory (API only).

## Configuration
Ensure your frontend `.env.local` has the correct API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5125/api
```
