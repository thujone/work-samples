using System;
using NGRM.Domain.Entities;
using NGRM.Domain.Interfaces.Mappers;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Lookups;
using NGRM.Domain.Model;

namespace NGRM.Domain.Mappers
{
    public class CustomerMapper : Mapper<Customer, CustomerEntity>, ICustomerMapper
    {
        public CustomerMapper(ICryptographyService cryptographyService) : base(cryptographyService)
        {
        }

        protected override void MapToModel(CustomerEntity source, Customer destination)
        {
            destination.Id = source.Id.ToString();
            destination.Scope = Scope.LookupByValue(source.ScopeId.GetValueOrDefault())?.Name;
            destination.ScopeId = source.ScopeId?.ToString();
            destination.Industry = Industry.LookupByValue(source.IndustryId.GetValueOrDefault())?.Name;
            destination.IndustryId = source.IndustryId?.ToString();
            destination.State = State.LookupByValue(source.StateId)?.Name;
            destination.StateId = source.StateId?.ToString();
            destination.Region = Region.LookupByValue(source.RegionId.GetValueOrDefault())?.Name;
            destination.RegionId = source.RegionId?.ToString();
            destination.Name = Decrypt<string>(source.NameBytes);
            destination.SubIndustry = source.SubIndustry;
            destination.AccountManager = Decrypt<string>(source.AccountManagerBytes);
            destination.TotalEmployeeCount = source.TotalEmployees?.ToString();
            destination.TotalLocationsCount = source.TotalLocations?.ToString();
            destination.FileId = source.FileId?.ToString();
        }

        protected override void MapToEntity(Customer source, CustomerEntity destination)
        {
            destination.Id = Convert.ToInt32(source.Id);
            destination.ScopeId = source.ScopeId != null ? Convert.ToInt32(source.ScopeId) : (int?) null;
            destination.IndustryId = source.IndustryId != null ? Convert.ToInt32(source.IndustryId) : (int?) null;
            destination.StateId = source.StateId != null ? Convert.ToInt32(source.StateId) : (int?) null;
            destination.RegionId = source.RegionId != null ? Convert.ToInt32(source.RegionId) : (int?) null;
            destination.TotalEmployees = source.TotalEmployeeCount != null ? Convert.ToInt32(source.TotalEmployeeCount) : (int?) null;
            destination.TotalLocations = source.TotalLocationsCount != null ? Convert.ToInt32(source.TotalLocationsCount) : (int?) null;
            destination.NameBytes = Encrypt(source.Name);
            destination.SubIndustry = source.SubIndustry;
            destination.AccountManagerBytes = Encrypt(source.AccountManager);
        }
    }
}
