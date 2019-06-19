using System.Security.Principal;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Model;

namespace NGRM.Domain.ExportMaps
{
    public class UserExportMap : ClassMap<User>
    {
        private readonly IPrincipal _user;
        private readonly IAccessService _accessService;

        public UserExportMap(IPrincipal user, IAccessService accessService)
        {
            _user = user;
            _accessService = accessService;
        }

        public void ApplyUserAccess()
        {
            var userAccess = _accessService.GetAccessRoles(_user);

            if (userAccess.userRoles.ContainsKey("UserName"))
            {
                var accessToUserName = userAccess.userRoles["UserName"];
                if (accessToUserName != null) Map(m => m.UserName).Name("Username");
            }

            if (userAccess.userRoles.ContainsKey("FirstName"))
            {
                var accessToFirstName = userAccess.userRoles["FirstName"];
                if (accessToFirstName != null) Map(m => m.FirstName).Name("First Name");
            }

            if (userAccess.userRoles.ContainsKey("LastName"))
            {
                var accessToLastName = userAccess.userRoles["LastName"];
                if (accessToLastName != null) Map(m => m.LastName).Name("Last Name");
            }

            if (userAccess.userRoles.ContainsKey("StatusId"))
            {
                var accessToStatusId = userAccess.userRoles["StatusId"];
                if (accessToStatusId != null) Map(m => m.Status).Name("Account Status");
            }

            if (userAccess.userRoles.ContainsKey("CustomerId"))
            {
                var accessToCustomer = userAccess.userRoles["CustomerId"];
                if (accessToCustomer != null) Map(m => m.Customer).Name("Customer");
            }

            if (userAccess.userRoles.ContainsKey("RoleId"))
            {
                var accessToRoleId = userAccess.userRoles["RoleId"];
                if (accessToRoleId != null) Map(m => m.Role).Name("Role");
            }

            if (userAccess.userRoles.ContainsKey("Department"))
            {
                var accessToDepartment = userAccess.userRoles["Department"];
                if (accessToDepartment != null) Map(m => m.Department).Name("Department");
            }

            if (userAccess.userRoles.ContainsKey("Description"))
            {
                var accessToDescription = userAccess.userRoles["Description"];
                if (accessToDescription != null) Map(m => m.Description).Name("Description");
            }

            if (userAccess.userRoles.ContainsKey("ExpirePassword"))
            {
                var accessToExpirePassword = userAccess.userRoles["ExpirePassword"];
                if (accessToExpirePassword != null) Map(m => m.ExpirePassword).Name("Force Password Change").TypeConverter<BooleanConverter>();
            }
        }
    }
}
