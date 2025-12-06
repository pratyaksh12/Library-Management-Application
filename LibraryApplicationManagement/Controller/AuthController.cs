using LibraryApplicationManagement.DTOs;
using LibraryApplicationManagement.Enums;
using LibraryApplicationManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplicationManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly UserManager<User> _usermanager;

        public AuthController(UserManager<User> userManager)
        {
            _usermanager = userManager;
        }


        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var existingUser = await _usermanager.FindByEmailAsync(model.Email);
            if(existingUser is not null)
            {
                return BadRequest("User with this email already exists");
            }

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                UniversityId = model.UniversityId,
                UniversityCard = model.UniversityCard,
                Status = UserStatus.Pending,
                Role = UserRole.User
            };

            var result = await _usermanager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest("Error creating the user");
            }

            return Ok(new {message = "User was created successfully"});
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _usermanager.FindByEmailAsync(model.Email);
            if(user is not null && await _usermanager.CheckPasswordAsync(user, model.Password))
            {
                return Ok(new {message = "User logged in successfully", userId = user.Id, email = user.Email});
            }

            return Unauthorized("Invalid email or password");
        }

    }
}
