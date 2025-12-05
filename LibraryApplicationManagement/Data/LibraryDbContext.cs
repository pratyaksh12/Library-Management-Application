using System;
using LibraryApplicationManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplicationManagement.Data;

public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    
    public DbSet<Book> Books {get; set;}
    public DbSet<BorrowRecord> BorrowRecords {get; set;}


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>().HasIndex(u => u.UniversityId).IsUnique();
        builder.Entity<User>().Property(u => u.Status).HasConversion<string>();
        builder.Entity<User>().Property(u => u.Role).HasConversion<string>();
        builder.Entity<BorrowRecord>().Property(br => br.Status).HasConversion<string>();

    }
}
