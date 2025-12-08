using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using LibraryApplicationManagement.Controller;
using LibraryApplicationManagement.Interfaces;
using LibraryApplicationManagement.Models;
using LibraryApplicationManagement.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace LibraryManagementTest
{
    public class BorrowControllerTests
    {
        // Mocks
        private readonly Mock<IBorrowRepository> _mockBorrowRepo;
        private readonly Mock<IBookRepository> _mockBookRepo;
        private readonly Mock<UserManager<User>> _mockUserManager;
        
        // System Under Test (SUT)
        private readonly BorrowController _controller;

        public BorrowControllerTests()
        {
            _mockBorrowRepo = new Mock<IBorrowRepository>();
            _mockBookRepo = new Mock<IBookRepository>();

            // Mocking UserManager is complex, so we use a helper setup
            var store = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);

            // Initialize the Controller with our mocks
            _controller = new BorrowController(_mockBorrowRepo.Object, _mockBookRepo.Object, _mockUserManager.Object);
        }

        [Fact]
        public async Task BorrowBook_ShouldReturnNotFound_WhenBookDoesNotExist()
        {
            // Arrange
            var bookId = Guid.NewGuid();
            
            // Setup Mock: When GetByIdAsync is called, return null
            _mockBookRepo.Setup(repo => repo.GetByIdAsync(bookId))
                .ReturnsAsync((Book?)null);

            var dto = new BorrowBookDto { BookId = bookId };

            // Act
            var result = await _controller.BorrowBook(dto);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult!.Value.Should().Be("Book not found");
        }

        [Fact]
        public async Task BorrowBook_ShouldReturnUnauthorized_WhenUserDoesNotExist()
        {
            //Arrange
            var bookId = new Guid();
            var userId = new Guid();

            //mock the repo

            _mockBookRepo.Setup(r => r.GetByIdAsync(bookId)).ReturnsAsync(new Book{Id = bookId, AvailableCopies = 1});

            //simulate th user
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            ]));

            _controller.ControllerContext = new ControllerContext{HttpContext = new DefaultHttpContext{User = userClaims}};

            _mockUserManager.Setup(u => u.FindByIdAsync(userId.ToString())).ReturnsAsync((User?)null);

            var dto = new BorrowBookDto{BookId = bookId};

            //Act
            var result = await _controller.BorrowBook(dto);

            //Assert
            result.Should().BeOfType<UnauthorizedObjectResult>();

        }

        [Fact]

        public async Task BorrowBook_ShouldReturnBadRequest_WhenNoCopiesAvailable()
        {
            //Arrange

            var bookId = new Guid();
            var userId = new Guid();


            //mock book having 0 copies
            _mockBookRepo.Setup(r => r.GetByIdAsync(bookId)).ReturnsAsync(new Book{Id = bookId, AvailableCopies = 0});

            //setup user context
            var userClaims = new ClaimsPrincipal(new ClaimsIdentity(
                [
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                ]
            ));


            var dto = new BorrowBookDto{BookId = bookId};

            //Act

            var result = await _controller.BorrowBook(dto);

            //Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }
    }
}
