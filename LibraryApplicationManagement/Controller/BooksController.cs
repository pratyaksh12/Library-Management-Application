using LibraryApplicationManagement.DTOs;
using LibraryApplicationManagement.Helpers;
using LibraryApplicationManagement.Interfaces;
using LibraryApplicationManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplicationManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _repository;

        public BooksController(IBookRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks([FromBody]BookQueryObject query)
        {
            var books = await _repository.GetAllAsync(query);
            
            // Map to DTO
            var bookDtos = books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                Genre = b.Genre,
                Rating = b.Rating,
                CoverColor = b.CoverColor,
                CoverUrl = b.CoverUrl,
                Description = b.Description,
                TotalCopies = b.TotalCopies,
                VideoUrl = b.VideoUrl,
                Summary = b.Summary,
                AvailableCopies = b.AvailableCopies
            });

            return Ok(bookDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(Guid id)
        {
            var book = await _repository.GetByIdAsync(id);

            if (book == null) return NotFound();

            // Map to DTO
            var bookDto = new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Genre = book.Genre,
                Rating = book.Rating,
                CoverColor = book.CoverColor,
                CoverUrl = book.CoverUrl,
                Description = book.Description,
                TotalCopies = book.TotalCopies,
                VideoUrl = book.VideoUrl,
                Summary = book.Summary,
                AvailableCopies = book.AvailableCopies
            };

            return Ok(bookDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto createBookDto)
        {
            var book = new Book
            {
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                Genre = createBookDto.Genre,
                Rating = createBookDto.Rating,
                CoverColor = createBookDto.CoverColor,
                CoverUrl = createBookDto.CoverUrl,
                Description = createBookDto.Description,
                TotalCopies = createBookDto.TotalCopies,
                AvailableCopies = createBookDto.TotalCopies,
                VideoUrl = createBookDto.VideoUrl,
            };

            await _repository.AddAsync(book);

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }
    }
}
