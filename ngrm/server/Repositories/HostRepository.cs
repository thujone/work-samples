using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Entities;

namespace NGRM.Infrastructure.Repositories
{
    public class HostRepository : BaseRepository<HostEntity, int>, IHostRepository
    {
        public HostRepository(CSPortalContext context) : base(context)
        {
        }

        protected override IEnumerable<HostEntity> GetEntities()
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .OrderBy(x => x.Id);
        }

        protected override HostEntity GetEntity(int id)
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .FirstOrDefault(x => x.Id == id);
        }

        public IEnumerable<HostEntity> GetByEngagementId(int engagementId)
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .Where(x => x.EngagementId == engagementId)
                .OrderBy(x => x.Id);
        }

        public IEnumerable<HostEntity> GetByPhaseId(int phaseId)
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .Where(x => x.PhaseId == phaseId)
                .OrderBy(x => x.Id);
        }

        public IEnumerable<HostEntity> GetByVulnerabilityId(int vulnerabilityId)
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .Where(x => x.HostVulnerabilities.Any(y => y.VulnerabilityId == vulnerabilityId))
                .OrderBy(x => x.Id);
        }

        public IEnumerable<HostEntity> GetByAssetGroupId(int assetGroupId)
        {
            return Context.Hosts
                .Include(x => x.Phase)
                .Include(x => x.AssetGroup)
                .Include(x => x.HostVulnerabilities)
                    .ThenInclude(x => x.Vulnerability)
                .Where(x => x.AssetGroupId == assetGroupId)
                .OrderBy(x => x.Id);
        }
    }
}
