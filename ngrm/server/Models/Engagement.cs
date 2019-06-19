using System.Collections.Generic;
using NGRM.Domain.Lookups;

namespace NGRM.Domain.Model
{
    public class Engagement
    {
        public Engagement()
        {
            OfferingList = new List<Resource>();
            StatusList = new List<Resource>();
            LossReasonList = new List<Resource>();
            ThreatLevelList = new List<Resource>();
            EngagementManagerList = new List<Resource>();
            LeadConsultantList = new List<Resource>();
            SupportConsultantList = new List<Resource>();
            CustomerList = new List<Resource>();
            OpportunityList = new List<Resource>();
            ThreatLevels = Lookups.ThreatLevel.List;
        }

        public string Id { get; set; }

        public string Customer { get; set; }

        public string CustomerId { get; set; }

        public string Opportunity { get; set; }

        public string OpportunityId { get; set; }

        public string Offering { get; set; }

        public string OfferingId { get; set; }

        public string Status { get; set; }

        public string StatusId { get; set; }

        public string TotalValue { get; set; }

        public string InitiatedDate { get; set; }

        public string PercentLikelihood { get; set; }

        public string PreSalesResource { get; set; }

        public string WinDate { get; set; }

        public string LossDate { get; set; }

        public string LossReason { get; set; }

        public string LossReasonId { get; set; }

        public string SalesOrderNumber { get; set; }

        public string BilledAmountPriorFiscalYear { get; set; }

        public string BilledAmountCurrentFiscalYear { get; set; }

        public string CompletedFiscalYear { get; set; }

        public string BillRate { get; set; }

        public string CostRate { get; set; }

        public string BaselineHours { get; set; }

        public string PlannedHours { get; set; }

        public string ActualHours { get; set; }

        public string EngagementManager { get; set; }

        public string LeadConsultant { get; set; }

        public string InternalKickoffDate { get; set; }

        public string ExternalKickoffDate { get; set; }

        public string StatusCallSchedule { get; set; }

        public string DeliverableDueDate { get; set; }

        public string ThreatLevel { get; set; }

        public string ThreatLevelId { get; set; }

        public string Notes { get; set; }

        public string FinalInvoiceDate { get; set; }

        public string SurveyScore { get; set; }

        public string RiskScore { get; set; }

        public string SurveyFeedback { get; set; }

        public List<Resource> SupportConsultantList { get; set; }

        public List<Resource> LeadConsultantList { get; set; }

        public List<Resource> EngagementManagerList { get; set; }

        public List<Resource> ThreatLevelList { get; set; }

        public List<Resource> LossReasonList { get; set; }

        public List<Resource> StatusList { get; set; }

        public List<Resource> OfferingList { get; set; }

        public List<Resource> CustomerList { get; set; }

        public List<Resource> OpportunityList { get; set; }

        public List<ThreatLevel> ThreatLevels { get; set; }
    }
}
