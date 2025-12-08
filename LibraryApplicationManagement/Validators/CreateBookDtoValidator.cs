using FluentValidation;
using LibraryApplicationManagement.DTOs;

namespace LibraryApplicationManagement.Validators
{
    public class CreateBookDtoValidator : AbstractValidator<CreateBookDto>
    {
        public CreateBookDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required");

            RuleFor(x => x.Genre)
                .NotEmpty().WithMessage("Genre is required");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

            RuleFor(x => x.TotalCopies)
                .GreaterThan(0).WithMessage("Total copies must be greater than 0");
        }
    }
}
