using System;
using LibraryApplicationManagement.Models;

namespace LibraryApplicationManagement.Interfaces;

public interface IBorrowRepository
{
    Task<BorrowRecord?> GetByIdAsync(Guid id);
    Task<IEnumerable<BorrowRecord>> GetByUserIdAsync(Guid userId);
    Task AddAsync(BorrowRecord record);
    Task UpdateAsync(BorrowRecord record);
    Task<List<BorrowRecord>> GetByUserId(Guid userId);
}
