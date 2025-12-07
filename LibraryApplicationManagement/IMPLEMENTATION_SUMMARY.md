# Implementation Summary

## 1. Borrowing Logic Implemented
We built the core feature for users to borrow and return books.
- **Repository Pattern**: Created `BorrowRepository` (and `IBorrowRepository`) to handle database operations for `BorrowRecord` entities.
- **Controller Logic**: Created `BorrowController` with two main endpoints:
  - `POST /api/Borrow`: Checks if the book exists, if the user exists, and if copies are available. It then creates a record and decrements the book count.
  - `POST /api/Borrow/return/{id}`: Marks the book as returned and increments the book count.
- **Validation**: Added checks to ensure you cannot borrow a book if `AvailableCopies` is 0, or if the `UserId` is invalid.

## 2. JWT Authentication & Security
We secured the API so that only logged-in users can perform actions.
- **Token Service**: Created `TokenService.cs` to generate secure JSON Web Tokens (JWT) containing the user's `Email`, `UserId`, and `Role`.
- **Login Response**: Updated `AuthController` to return this token upon successful login.
- **Middleware Fix**: Updated `Program.cs` to explicitly tell ASP.NET to use **JWT Bearer** as the default scheme for everything (Authentication, Challenge, etc.), preventing ASP.NET Identity from overriding it with Cookies.
  ```csharp
  builder.Services.AddAuthentication(options => {
      options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      // ...
  })
  ```

## 3. Swagger Configuration
We configured Swagger to support JWTs.
- Added the **"Authorize"** button (green padlock) to the Swagger UI.
- Configured the security definition to accept `Bearer <token>`.

## 4. Data Seeding
We created a `DbSeeder` class to automatically populate your database with initial data:
- **Books**: 3 Sample Books ("The Great Gatsby", "Clean Code", "1984").
- **Admin User**: `admin@library.com` / `Admin@123`.

## How to Run & Test
1. **Run the App**: `dotnet run`
2. **Login**: `POST /api/Auth/login` with the admin credentials. Copy the `token`.
3. **Authorize**: Click the Padlock in Swagger, paste the token.
4. **Borrow**: `POST /api/Borrow` with a valid `bookId` and your `userId`.
