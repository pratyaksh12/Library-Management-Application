using System;
using LibraryApplicationManagement.Data;
using LibraryApplicationManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplicationManagement.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<LibraryDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            // 1. Ensure Database is Created
            await context.Database.EnsureCreatedAsync();

            // 2. Seed Books if empty
            if (!await context.Books.AnyAsync())
            {
                var books = new List<Book>
                {
                    new Book
                    {
                        Title = "The Great Gatsby",
                        Author = "F. Scott Fitzgerald",
                        Genre = "Classic",
                        Rating = 5,
                        CoverUrl = "https://example.com/gatsby.jpg",
                        CoverColor = "#FFD700",
                        Description = "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                        TotalCopies = 5,
                        AvailableCopies = 5,
                        VideoUrl = "https://youtube.com/gatsby",
                        Summary = "Rich man loves girl, tragedy ensues."
                    },
                    new Book
                    {
                        Title = "Clean Code",
                        Author = "Robert C. Martin",
                        Genre = "Technology",
                        Rating = 5,
                        CoverUrl = "https://example.com/cleancode.jpg",
                        CoverColor = "#FFFFFF",
                        Description = "A Handbook of Agile Software Craftsmanship.",
                        TotalCopies = 3,
                        AvailableCopies = 3,
                        VideoUrl = "https://youtube.com/cleancode",
                        Summary = "How to write better code."
                    },
                    new Book
                    {
                        Title = "1984",
                        Author = "George Orwell",
                        Genre = "Dystopian",
                        Rating = 4,
                        CoverUrl = "https://example.com/1984.jpg",
                        CoverColor = "#FF0000",
                        Description = "A dystopian social science fiction novel and cautionary tale.",
                        TotalCopies = 10,
                        AvailableCopies = 10,
                        VideoUrl = "https://youtube.com/1984",
                        Summary = "Big Brother is watching you."
                    }
                };

                await context.Books.AddRangeAsync(books);
                await context.SaveChangesAsync();
            }

            // 3. Seed Admin User if not exists
            var adminEmail = "admin@library.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var admin = new User
                {
                    UserName = "admin",
                    Email = adminEmail,
                    FullName = "Super Admin",
                    UniversityId = 1,
                    UniversityCard = "ADMIN-001",
                    Status = Enums.UserStatus.Approved,
                    Role = Enums.UserRole.Admin
                };

                await userManager.CreateAsync(admin, "Admin@123");
            }
        }
    }
}
