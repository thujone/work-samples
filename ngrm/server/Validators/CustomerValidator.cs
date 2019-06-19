using NGRM.Domain.Extensions;
using NGRM.Domain.Interfaces.Validators;
using NGRM.Domain.Model;
using FluentValidation;

namespace NGRM.Domain.Validators
{
    public class CustomerValidator : AbstractValidator<Customer>, ICustomerValidator
    {
        public CustomerValidator()
        {
            RuleFor(customer => customer.Name)
                .NotEmpty()
                .Length(1, 100);

            RuleFor(customer => customer.SubIndustry)
                .Length(0, 100)
                .WithName("Sub-Industry");

            RuleFor(customer => customer.AccountManager)
                .Length(0, 75);

            RuleFor(customer => customer.TotalEmployeeCount)
                .Number()
                .WithName("Total Employees");

            RuleFor(customer => customer.TotalLocationsCount)
                .Number()
                .WithName("Total Locations");
        }
    }
}
