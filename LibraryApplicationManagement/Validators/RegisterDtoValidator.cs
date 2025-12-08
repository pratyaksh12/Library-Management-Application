using FluentValidation;
using LibraryApplicationManagement.DTOs;

namespace LibraryApplicationManagement.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required");

            RuleFor(x => x.UniversityCard)
                .NotEmpty().WithMessage("University Card is required");

            RuleFor(x => x.UniversityId)
                .GreaterThan(0).WithMessage("University ID must be valid");
        }
    }
}
