namespace NGRM.Domain.Lookups
{
    public class MitigationStatus : Lookup<MitigationStatus, int>
    {
        private MitigationStatus(string name, int value, string color = null)
            : base(name, value, color) { }

        public static MitigationStatus NotMitigated => new MitigationStatus("Not Mitigated", 1);
        public static MitigationStatus MitigationInProgress => new MitigationStatus("Mitigation In Progress", 2);
        public static MitigationStatus PartiallyMitigated => new MitigationStatus("Partially Mitigated", 3);
        public static MitigationStatus FullyMitigated => new MitigationStatus("Fully Mitigated", 4);
        public static MitigationStatus Accepted => new MitigationStatus("Accepted", 5);
        public static MitigationStatus Transferred => new MitigationStatus("Transferred", 6);
        public static MitigationStatus Voided => new MitigationStatus("Voided", 7);
    }
}
