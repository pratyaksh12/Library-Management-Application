using System;
using LibraryApplicationManagement.Data;
using LibraryApplicationManagement.Helpers;
using LibraryApplicationManagement.Interfaces;
using LibraryApplicationManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplicationManagement.Repository;

public class BookRepository : IBookRepository
{
    private readonly LibraryDbContext _context;

    public BookRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Book>> GetAllAsync(BookQueryObject query)
    {
        var books = _context.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Title))
        {
            books = books.Where(b => b.Title.Contains(query.Title));
        }

        if (!string.IsNullOrWhiteSpace(query.Genre))
        {
            books = books.Where(b => b.Genre.Contains(query.Genre));
        }

        if (!string.IsNullOrWhiteSpace(query.SortBy))
        {
            if (query.SortBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
            {
                books = query.IsDescending ? books.OrderByDescending(b => b.Title) : books.OrderBy(b => b.Title);
            }
        }

        var skipNumber = (query.PageNumber - 1) * query.PageSize;

        return await books.Skip(skipNumber).Take(query.PageSize).ToListAsync();
    }

    public async Task<Book?> GetByIdAsync(Guid id)
    {
        return await _context.Books.FindAsync(id);
    }

    public async Task AddAsync(Book book)
    {
        await _context.Books.AddAsync(book);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Book book)
    {
        _context.Books.Update(book);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book != null)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }
    }
}
