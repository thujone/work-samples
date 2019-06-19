using NGRM.Domain.Model;

namespace NGRM.Domain.Interfaces.Services
{
    public interface IDashboardService 
    {
        Dashboard Get(string chartSet, int engagementId);
    }
}