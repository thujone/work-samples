using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Entities;

namespace NGRM.Infrastructure.Repositories
{
    public class ImportRepository : BaseRepository<ImportEntity, int>, IImportRepository
    {
        public ImportRepository(CSPortalContext context) : base(context)
        {
        }

        protected override IEnumerable<ImportEntity> GetEntities()
        {
            return Context.Imports;
        }

        protected override ImportEntity GetEntity(int id)
        {
            return Context.Imports
                .OrderBy(x => x.Id)
                .FirstOrDefault(x => x.Id == id);
        }

        public IEnumerable<ImportEntity> GetByEngagementId(int engagementId)
        {
            return Context.Imports
                .Where(x => x.EngagementId == engagementId);
        }

        public IEnumerable<ImportEntity> GetByPhaseId(int phaseId)
        {
            return Context.Imports
                .Where(x => x.PhaseId == phaseId);
        }

        public ImportEntity GetLatest(int engagementId)
        { 
            return Context.Imports
                .OrderBy(x => x.Id)
                .LastOrDefault(x => x.EngagementId == engagementId);
        }

        public ImportEntity GetLatestByPhaseId(int phaseId)
        {
            return Context.Imports
                .OrderBy(x => x.Id)
                .LastOrDefault(x => x.PhaseId == phaseId);
        }

        public ImportEntity GetPenultimate(int engagementId)
        {
            return Context.Imports
                .Where(x => x.EngagementId == engagementId)
                .OrderByDescending(x => x.Id)
                .Skip(1)
                .FirstOrDefault();
        }

        public ImportEntity GetPenultimateByPhaseId(int phaseId)
        {
            return Context.Imports
                .Where(x => x.PhaseId == phaseId)
                .OrderByDescending(x => x.Id)
                .Skip(1)
                .FirstOrDefault();
        }
    }
}