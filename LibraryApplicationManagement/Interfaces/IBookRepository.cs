using System;
using LibraryApplicationManagement.Helpers;
using LibraryApplicationManagement.Models;

namespace LibraryApplicationManagement.Interfaces;

public interface IBookRepository
{
    Task<IEnumerable<Book>> GetAllAsync(BookQueryObject query);
    Task<Book?> GetByIdAsync(Guid id);
    Task AddAsync(Book book);
    Task UpdateAsync(Book book);
    Task DeleteAsync(Guid id);
}
