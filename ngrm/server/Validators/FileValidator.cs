using NGRM.Domain.Model;
using FluentValidation;

namespace NGRM.Domain.Validators
{
    public class FileValidator : AbstractValidator<File>
    {
        public const string NO_FILE_SELECTED_MESSAGE = "No file selected";
        public const string INVALID_FILE_TYPE_SELECTED_MESSAGE = "Invalid file type selected";

        public FileValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.StopOnFirstFailure)
                .NotEmpty()
                .WithMessage(NO_FILE_SELECTED_MESSAGE)
                .Length(1, 500)
                .Must(x => x.Trim('\"').EndsWith(".doc") || x.Trim('\"').EndsWith(".docm") || x.Trim('\"').EndsWith(".docx")
                    || x.Trim('\"').EndsWith(".xls") || x.Trim('\"').EndsWith(".xlsm") || x.Trim('\"').EndsWith(".xlsx")
                    || x.Trim('\"').EndsWith(".ppt") || x.Trim('\"').EndsWith(".pptm") || x.Trim('\"').EndsWith(".pptx")
                    || x.Trim('\"').EndsWith(".vsd") || x.Trim('\"').EndsWith(".vsdm") || x.Trim('\"').EndsWith(".vsdx")
                    || x.Trim('\"').EndsWith(".pdf"))
                .WithMessage(INVALID_FILE_TYPE_SELECTED_MESSAGE);
        }
    }
}