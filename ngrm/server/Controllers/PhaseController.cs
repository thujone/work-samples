using System.Collections.Generic;
using System.Linq;
using NGRM.Domain.Extensions;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Interfaces.Validators;
using NGRM.Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NGRM.Web.Controllers.Api
{
    [Authorize]
    [Route("api/Phase")]
    public class PhaseController : Controller
    {
        private readonly IAccessService _accessService;
        private readonly IPhaseService _phaseService;
        private readonly IPhaseValidator _phaseValidator;

        public PhaseController(
            IAccessService accessService,
            IPhaseService phaseService,
            IPhaseValidator phaseValidator)
        {
            _accessService = accessService;
            _phaseService = phaseService;
            _phaseValidator = phaseValidator;
        }

        [HttpGet]
        [Route("{engagementId}")]
        public IEnumerable<Phase> Get(int engagementId)
        {
            if (!_accessService.AllowGetPhase(User, engagementId))
                return Enumerable.Empty<Phase>();

            return _phaseService.GetPhases(engagementId)
                .OrderByDescending(x => x.Id);
        }

        [HttpGet]
        [Route("{engagementId}/{phaseId}")]
        public Phase Get(int engagementId, int phaseId)
        {
            if (!_accessService.AllowGetPhase(User, engagementId))
                return new Phase();

            return phaseId > 0 ? _phaseService.Get(phaseId) : new Phase {EngagementId = engagementId};
        }

        [HttpPost]
        public IActionResult Post([FromBody]Phase phase)
        {
            if (!_accessService.AllowPostPhase(User, phase.EngagementId))
                return StatusCode(403);

            var validationResult = _phaseValidator.Validate(phase);
            if (!validationResult.IsValid)
            {
                ModelState.AddValidationResult(validationResult);
                return BadRequest(ModelState);
            }

            if (phase.Id > 0)
                _phaseService.Update(phase);
            else
                _phaseService.Add(phase);

            return Ok(phase);
        }

        [HttpDelete]
        [Route("{phaseId}")]
        public IActionResult Delete(int phaseId)
        {
            var phase = _phaseService.Get(phaseId);
            if (!_accessService.AllowDeletePhase(User, phase.EngagementId))
                return StatusCode(403);

            _phaseService.Remove(phaseId);
            return Ok();
        }
    }
}

