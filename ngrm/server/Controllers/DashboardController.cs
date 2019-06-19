using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Model;
using NGRM.Domain.Extensions;
using NGRM.Domain.Interfaces.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NGRM.Web.Controllers.Api
{
    [Authorize]
    [Route("api/Dashboard")]
    public class DashboardController : Controller
    {
        private readonly IAccessService _accessService;
        private readonly IDashboardService _dashboardService;

        public DashboardController(IAccessService accessService, IDashboardService dashboardService)
        {
            _accessService = accessService;
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [Route("{chartSet}/{engagementId}")]
        public IActionResult Get(string chartSet, int engagementId)
        {
            if (!_accessService.AllowGetRisk(User, engagementId)
                && !_accessService.AllowGetVulnerability(User, engagementId)
                && !_accessService.AllowGetHost(User, engagementId)
                && !_accessService.AllowGetGovernanceControl(User, engagementId)
                && !_accessService.AllowGetComplianceHipaa(User, engagementId)
                && !_accessService.AllowGetEngagement(User, engagementId)
                && !_accessService.AllowGetCustomer(User, engagementId)
                && !_accessService.AllowGetImport(User, engagementId))
                return Ok(new Dashboard());

            Dashboard dashboard = _dashboardService.Get(chartSet, engagementId);
            if (dashboard == new Dashboard()) {
                return StatusCode(403);
            } else {
                return Ok(dashboard);
            }
        }
    }
}
