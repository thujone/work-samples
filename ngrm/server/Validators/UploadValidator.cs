using NGRM.Domain.Interfaces.Validators;
using NGRM.Domain.Model;
using FluentValidation;

namespace NGRM.Domain.Validators
{
    public class UploadValidator : AbstractValidator<Upload>, IUploadValidator
    {
        public const string NO_FILE_SELECTED_MESSAGE = "No file selected";
        public const string INVALID_FILE_TYPE_SELECTED_MESSAGE = "Invalid file type selected";

        public UploadValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty()
                .Length(1, 128)
                .WithName("Username");

            RuleFor(x => x.Files)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(NO_FILE_SELECTED_MESSAGE)
                .SetCollectionValidator(new FileValidator());
        }
    }
}
