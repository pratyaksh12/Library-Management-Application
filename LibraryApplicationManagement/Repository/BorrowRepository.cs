using System;
using LibraryApplicationManagement.Data;
using LibraryApplicationManagement.Interfaces;
using LibraryApplicationManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplicationManagement.Repository;

public class BorrowRepository : IBorrowRepository
{
    private readonly LibraryDbContext _context;

    public BorrowRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<BorrowRecord?> GetByIdAsync(Guid id)
    {
        return await _context.BorrowRecords
            .Include(b => b.Book)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<BorrowRecord>> GetByUserIdAsync(Guid userId)
    {
        return await _context.BorrowRecords
            .Include(b => b.Book)
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(BorrowRecord record)
    {
        await _context.BorrowRecords.AddAsync(record);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(BorrowRecord record)
    {
        _context.BorrowRecords.Update(record);
        await _context.SaveChangesAsync();
    }

    public async Task<List<BorrowRecord>> GetByUserId(Guid userId)
    {
        return await _context.BorrowRecords
            .Include(br => br.Book)
            .Where(br => br.UserId == userId)
            .OrderByDescending(br => br.BorrowDate)
            .ToListAsync();
    }

}
