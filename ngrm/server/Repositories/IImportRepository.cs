using System.Collections.Generic;
using NGRM.Domain.Entities;

namespace NGRM.Domain.Interfaces.Repositories
{
    public interface IImportRepository : IDataRepository<ImportEntity, int>
    {
        IEnumerable<ImportEntity> GetByEngagementId(int engagementId);
        IEnumerable<ImportEntity> GetByPhaseId(int phaseId);
        ImportEntity GetLatest(int engagementId);
        ImportEntity GetLatestByPhaseId(int phaseId);
        ImportEntity GetPenultimate(int engagementId);
        ImportEntity GetPenultimateByPhaseId(int phaseId);
    }
}