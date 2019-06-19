using System;
using System.Collections.Generic;
using NGRM.Domain.Lookups;

namespace NGRM.Domain.Model
{
    public class User
    {
        public User()
        {
            CustomerList = new List<Resource>();
            RoleList = new List<Resource>();
            StatusList = new List<Resource>();
            StatusId = UserStatus.Active.Value.ToString();
        }

        //Form Properties
        public string Id { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StatusId { get; set; }
        public string CustomerId { get; set; }
        public string RoleId { get; set; }
        public int? FileId { get; set; }
        public string Department { get; set; }
        public string Description { get; set; }
        public string ResetPassword { get; set; }
        public string ConfirmPassword { get; set; }
        public bool ExpirePassword { get; set; }
        public string UpdatedBy { get; set; }

        //Display Helpers
        public string Name { get; set; }
        public string Customer { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }

        //Dropdown Lists
        public List<Resource> CustomerList { get; set; }
        public List<Resource> RoleList { get; set; }
        public List<Resource> StatusList { get; set; }
    }
}
