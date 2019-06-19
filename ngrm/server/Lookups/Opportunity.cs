namespace NGRM.Domain.Lookups
{
    public class Opportunity : Lookup<Opportunity, int>
    {
        private Opportunity(string name, int value, string color = null)
            : base(name, value, color) { }

        public static Opportunity Awareness => new Opportunity("Awareness", 1);
        public static Opportunity Comprehensive => new Opportunity("Comprehensive", 2);
        public static Opportunity Compromise => new Opportunity("Compromise", 3);
        public static Opportunity HIPAA => new Opportunity("HIPAA", 4);
        public static Opportunity ISO27001 => new Opportunity("ISO 27001", 5);
        public static Opportunity NERCCIP => new Opportunity("NERC CIP", 6);
        public static Opportunity NGRM => new Opportunity("NGRM", 7);
        public static Opportunity NISTCSF => new Opportunity("NIST CSF", 8);
        public static Opportunity Partial => new Opportunity("Partial", 9);
        public static Opportunity PCIOther => new Opportunity("PCI - Other", 10);
        public static Opportunity PCIRFP => new Opportunity("PCI - RFP", 11);
        public static Opportunity PCISAQ => new Opportunity("PCI - SAQ", 12);
        public static Opportunity PolicyDev => new Opportunity("Policy Dev", 13);
        public static Opportunity ProgramArch => new Opportunity("Program Arch", 14);
        public static Opportunity RemoteAccess => new Opportunity("Remote Access", 15);
        public static Opportunity RFP => new Opportunity("RFP", 16);
    }
}