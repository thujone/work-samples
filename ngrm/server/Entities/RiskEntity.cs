using System;
using System.Collections.Generic;
using NGRM.Domain.Interfaces.Entities;

namespace NGRM.Domain.Entities
{
    public class RiskEntity : IDomainEntity<int>
    {
        public RiskEntity()
        {
            RiskVulnerabilities = new HashSet<RiskVulnerabilityEntity>();
        }

        public int Id { get; set; }

        public int EngagementId { get; set; }

        public int? PhaseId { get; set; }

        public int? RemediationStatusId { get; set; }

        public int? ResourceId { get; set; }

        public int? GroupId { get; set; }

        public byte[] NameBytes { get; set; }

        public byte[] DescriptionBytes { get; set; }

        public byte[] RecommendationBytes { get; set; }

        public DateTime? MitigatedDate { get; set; }

        public DateTime? TargetRemediationDate { get; set; }

        public decimal? InheritScore { get; set; }

        public decimal? FinalScore { get; set; }

        public decimal? Likelihood { get; set; }

        public decimal? Impact { get; set; }

        public int? AffectedSystems { get; set; }

        public int? PossibleAffectedSystems { get; set; }

        public decimal? Effectiveness { get; set; }

        public decimal? ControlEffectiveness { get; set; }

        public byte[] ReferencesBytes { get; set; }

        public virtual PhaseEntity Phase { get; set; }

        public virtual ResourceEntity Resource { get; set; }

        public virtual GroupEntity Group { get; set; }

        public virtual ICollection<RiskVulnerabilityEntity> RiskVulnerabilities { get; set; }
    }
}