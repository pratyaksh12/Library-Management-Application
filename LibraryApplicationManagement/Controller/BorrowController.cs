using LibraryApplicationManagement.DTOs;
using LibraryApplicationManagement.Enums;
using LibraryApplicationManagement.Interfaces;
using LibraryApplicationManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplicationManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]

    public class BorrowController : ControllerBase
    {
        private readonly IBorrowRepository _borrowRepository;
        private readonly IBookRepository _bookRepository;
        private readonly UserManager<User> _userManager;

        public BorrowController(IBorrowRepository borrowRepository, IBookRepository bookRepository, UserManager<User> userManager)
        {
            _borrowRepository = borrowRepository;
            _bookRepository = bookRepository;
            _userManager = userManager;
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok("Borrow Controller is working");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> BorrowBook([FromBody] BorrowBookDto model)
        {
            // 1. Get Book
            var book = await _bookRepository.GetByIdAsync(model.BookId);
            if (book == null) return NotFound("Book not found");

            // 2. Check User
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.NameId);
            if(userIdClaim is null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);
            
            // Verify user exists in DB (prevents deleted users with valid tokens from borrowing)
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return Unauthorized("User no longer exists");

            // 3. Check Availability
            if (book.AvailableCopies <= 0)
            {
                return BadRequest("Book is not available");
            }

            // 4. Create Record
            var borrowRecord = new BorrowRecord
            {
                BookId = model.BookId,
                UserId = userId,
                BorrowDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(14), // Default 2 weeks
                Status = BorrowStatus.Borrowed,
                ReturnDate = null
            };

            // 5. Update Book Copies
            book.AvailableCopies--;
            await _bookRepository.UpdateAsync(book);

            // 6. Save Record
            await _borrowRepository.AddAsync(borrowRecord);

            return Ok(new { message = "Book borrowed successfully", recordId = borrowRecord.Id });
        }

        [HttpPost("return/{id}")]
        [Authorize]
        public async Task<IActionResult> ReturnBook(Guid id)
        {
            var record = await _borrowRepository.GetByIdAsync(id);
            if (record == null) return NotFound("Borrow record not found");

            if (record.Status == BorrowStatus.Returned)
            {
                return BadRequest("Book already returned");
            }

            // Update Record
            record.ReturnDate = DateTime.UtcNow;
            record.Status = BorrowStatus.Returned;
            await _borrowRepository.UpdateAsync(record);

            // Update Book Copies
            var book = await _bookRepository.GetByIdAsync(record.BookId);
            if (book != null)
            {
                book.AvailableCopies++;
                await _bookRepository.UpdateAsync(book);
            }

            return Ok(new { message = "Book returned successfully" });
        }

        [HttpGet("my-books")]
        [Authorize]
        public async Task<IActionResult> GetMyBorrowedBooks()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.NameId);

            if (userIdClaim is null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);

            var records = await _borrowRepository.GetByUserId(userId);

            var history = records.Select(r => new UserBorrowHistoryDto
            {
                RecordId = r.Id,
                BookTitle = r.Book?.Title ?? "Unknown",
                Author = r.Book?.Author ?? "Unknown",
                BorrowDate = r.BorrowDate,
                DueDate = r.DueDate,
                ReturnDate = r.ReturnDate,
                Status = r.Status
            });

            return Ok(history);

        }
    }
}
