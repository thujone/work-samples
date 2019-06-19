using System.Collections.Generic;

namespace NGRM.Domain.Model
{
    public class Dashboard
    {
        public Dashboard()
        {
            VulnerabilitiesBySeverity = new Highchart();
            VulnerabilitiesByCategory = new Highchart();
            Vulnerabilities = new Highchart();
            RiskByImpact = new Highchart();
            RiskByScore = new Highchart();
            RiskByLikelihood = new Highchart();
            RiskByPhase = new Highchart();
            TopRiskByScore = new Highchart();
            RiskGauge = new Highchart();
            GovernanceControlsByRiskLevel = new Highchart();
            GovernanceControlsByMaturityLevel = new Highchart();
            RiskScoreByPhase = new Highchart();
            ComplianceHipaaByGapReview = new Highchart();
            ComplianceHipaaByMaturityLevel = new Highchart();
            MitigationSummaryRisks = new Dictionary<int, Highchart>();
            MitigationSummaryRisksByPhase = new Dictionary<int, Highchart>();
            MitigationSummaryRisksAndVulns = new Dictionary<int, Highchart>();
            ComplianceByGapReview = new Dictionary<int, Highchart>();
            ComplianceByMaturityLevel = new Dictionary<int, Highchart>();
        }
        
        public string Status { get; set; }
        public string ExternalKickoffDate { get; set; }
        public string DeliverableDueDate { get; set; }
        public string RiskScore { get; set; }
        public string EngagementManager { get; set; }
        public string CustomerName { get; set; }
        public string CustomerIndustry { get; set; }
        public string CustomerAccountManager { get; set; }
        public string CustomerRegion { get; set; }
        public Highchart HostsByOperatingSystem { get; set; }
        public Highchart VulnerabilitiesBySeverity { get; set; }
        public Highchart VulnerabilitiesByCategory { get; set; }
        public Highchart Vulnerabilities { get; set; }
        public Highchart RiskByImpact { get; set; }
        public Highchart RiskByScore { get; set; }
        public Highchart RiskByLikelihood { get; set; }
        public Highchart RiskByPhase { get; set; }
        public Highchart TopRiskByScore { get; set; }
        public Highchart RiskGauge { get; set; }
        public Highchart GovernanceControlsByRiskLevel { get; set; }
        public Highchart GovernanceControlsByMaturityLevel { get; set; }
        public Highchart RiskScoreByPhase { get; set; }
        public Highchart ComplianceHipaaByGapReview { get; set; }
        public Highchart ComplianceHipaaByMaturityLevel { get; set; }
        public Dictionary<int, Highchart> ComplianceByGapReview { get; set; }
        public Dictionary<int, Highchart> ComplianceByMaturityLevel { get; set; }
        public Dictionary<int, Highchart> MitigationSummaryRisks { get; set; }
        public Dictionary<int, Highchart> MitigationSummaryRisksByPhase { get; set; }
        public Dictionary<int, Highchart> MitigationSummaryRisksAndVulns { get; set; }

    }
}
