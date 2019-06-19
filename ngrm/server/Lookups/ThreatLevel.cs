namespace NGRM.Domain.Lookups
{
    public class ThreatLevel : Lookup<ThreatLevel, decimal?>
    {
        private ThreatLevel(string name, decimal? value = null, string color = null)
            : base(name, value, color) { }

        public static ThreatLevel Unknown => new ThreatLevel("Unknown", null, "#cccccc");
        public static ThreatLevel VeryLow => new ThreatLevel("Very Low", 0, "#439539");
        public static ThreatLevel Low => new ThreatLevel("Low", 0.5m, "#b2bb1e");
        public static ThreatLevel Moderate => new ThreatLevel("Moderate", 2.1m, "#ffc425");
        public static ThreatLevel High => new ThreatLevel("High", 8, "#f19522");
        public static ThreatLevel VeryHigh => new ThreatLevel("Very High", 9.6m, "#f15d22");
    }
}
