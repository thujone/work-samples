using System.Security.Principal;
using CsvHelper.Configuration;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Model;

namespace NGRM.Domain.ExportMaps
{
    public class ComplianceExportMap : ClassMap<Compliance>
    {
        private readonly IPrincipal _user;
        private readonly IAccessService _accessService;

        public ComplianceExportMap(IPrincipal user, IAccessService accessService)
        {
            _user = user;
            _accessService = accessService;
        }

        public void ApplyUserAccess()
        {
            var userAccess = _accessService.GetAccessRoles(_user);

            if (userAccess.complianceRoles.ContainsKey("Name"))
            {
                var accessToName = userAccess.complianceRoles["Name"];
                if (accessToName != null) Map(m => m.Scheme).Name("Name");
            }

            if (userAccess.complianceRoles.ContainsKey("Rule"))
            {
                var accessToName = userAccess.complianceRoles["Rule"];
                if (accessToName != null) Map(m => m.Rule).Name("Rule");
            }

            if (userAccess.complianceRoles.ContainsKey("SectionTitle"))
            {
                var accessToName = userAccess.complianceRoles["SectionTitle"];
                if (accessToName != null) Map(m => m.SectionTitle).Name("Section Title");
            }

            if (userAccess.complianceRoles.ContainsKey("SubsectionTitle"))
            {
                var accessToName = userAccess.complianceRoles["SubsectionTitle"];
                if (accessToName != null) Map(m => m.SubsectionTitle).Name("Subsection Title");
            }

            if (userAccess.complianceRoles.ContainsKey("SubsectionText"))
            {
                var accessToName = userAccess.complianceRoles["SubsectionText"];
                if (accessToName != null) Map(m => m.SubsectionText).Name("Subsection Text");
            }

            if (userAccess.complianceRoles.ContainsKey("Implementation"))
            {
                var accessToName = userAccess.complianceRoles["Implementation"];
                if (accessToName != null) Map(m => m.Implementation).Name("Implementation");
            }

            if (userAccess.complianceRoles.ContainsKey("ImplementationSpecificText"))
            {
                var accessToName = userAccess.complianceRoles["ImplementationSpecificText"];
                if (accessToName != null) Map(m => m.ImplementationSpecificText).Name("Implementation Specific Text");
            }

            if (userAccess.complianceRoles.ContainsKey("CurrentState"))
            {
                var accessToName = userAccess.complianceRoles["CurrentState"];
                if (accessToName != null) Map(m => m.CurrentState).Name("Current State");
            }

            if (userAccess.complianceRoles.ContainsKey("ReferenceNotes"))
            {
                var accessToName = userAccess.complianceRoles["ReferenceNotes"];
                if (accessToName != null) Map(m => m.ReferenceNotes).Name("Reference Notes");
            }

            if (userAccess.complianceRoles.ContainsKey("CompliantStatusId"))
            {
                var accessToName = userAccess.complianceRoles["CompliantStatusId"];
                if (accessToName != null) Map(m => m.Compliant).Name("Compliance");
            }

            if (userAccess.complianceRoles.ContainsKey("CmmiStatusId"))
            {
                var accessToName = userAccess.complianceRoles["CmmiStatusId"];
                if (accessToName != null) Map(m => m.CmmiStatus).Name("Maturity Level");
            }

            if (userAccess.complianceRoles.ContainsKey("RemediationStatusId"))
            {
                var accessToName = userAccess.complianceRoles["RemediationStatusId"];
                if (accessToName != null) Map(m => m.RemediationStatus).Name("Remediation Status");
            }

            if (userAccess.complianceRoles.ContainsKey("RemediationResource"))
            {
                var accessToName = userAccess.complianceRoles["RemediationResource"];
                if (accessToName != null) Map(m => m.RemediationResource).Name("Remediation Resource");
            }

            if (userAccess.complianceRoles.ContainsKey("RemediationDate"))
            {
                var accessToName = userAccess.complianceRoles["RemediationDate"];
                if (accessToName != null) Map(m => m.RemediationDate).Name("Remediation Date");
            }

            if (userAccess.complianceRoles.ContainsKey("RemediationNotes"))
            {
                var accessToName = userAccess.complianceRoles["RemediationNotes"];
                if (accessToName != null) Map(m => m.RemediationNotes).Name("Remediation Notes");
            }

            Map(m => m.ImportedDate).Name("Imported Date");
            Map(m => m.ImportedBy).Name("Imported By");
            Map(m => m.UpdatedDate).Name("Updated Date");
            Map(m => m.UpdatedBy).Name("Updated By");
        }
    }
}
