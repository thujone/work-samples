using System.Collections.Generic;
using NGRM.Domain.Entities;
using NGRM.Domain.Interfaces.Mappers;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Lookups;
using NGRM.Domain.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace NGRM.Domain.Test.Services
{
    [TestClass]
    public class DashboardServiceTest : CryptographyTest
    {
        private Mock<IEngagementRepository> _mockEngagementRepository;
        private Mock<IHostRepository> _mockHostRepository;
        private Mock<IHostMapper> _mockHostMapper;
        private Mock<IVulnerabilityRepository> _mockVulnerabilityRepository;
        private Mock<IVulnerabilityMapper> _mockVulnerabilityMapper;
        private Mock<IRiskRepository> _mockRiskRepository;
        private Mock<ICustomerRepository> _mockCustomerRepository;
        private Mock<IGovernanceControlRepository> _mockGovernanceControlRepository;
        private Mock<IPhaseRepository> _mockPhaseRepository;
        private Mock<IComplianceRepository> _mockComplianceRepository;
        private Mock<IComplianceSchemeRepository> _mockComplianceSchemeRepository;
        private Mock<IImportRepository> _mockImportRepository;
        private Mock<ICryptographyService> _mockCryptographyService;
        private DashboardService _dashboardService;
        private EngagementEntity _engagementEntity;
        private ImportEntity _importEntity;
        private CustomerEntity _customerEntity;
        private List<RiskEntity> _riskEntities;
        private List<VulnerabilityEntity> _vulnerabilityEntities;
        private List<HostEntity> _hostEntities;
        private List<GovernanceControlEntity> _governanceControlEntities;
        private List<PhaseEntity> _phaseEntities;
        private List<ImportEntity> _importEntities;
        private List<ComplianceEntity> _complianceEntities;
        private List<ComplianceSchemeEntity> _complianceSchemeEntities;

        [TestInitialize]
        public void SetUp()
        {
            _mockEngagementRepository = new Mock<IEngagementRepository>();
            _mockHostRepository = new Mock<IHostRepository>();
            _mockHostMapper = new Mock <IHostMapper>();
            _mockVulnerabilityRepository = new Mock<IVulnerabilityRepository>();
            _mockVulnerabilityMapper = new Mock<IVulnerabilityMapper>();
            _mockRiskRepository = new Mock<IRiskRepository>();
            _mockCustomerRepository = new Mock<ICustomerRepository>();
            _mockGovernanceControlRepository = new Mock<IGovernanceControlRepository>();
            _mockPhaseRepository = new Mock<IPhaseRepository>();
            _mockComplianceRepository = new Mock<IComplianceRepository>();
            _mockComplianceSchemeRepository = new Mock<IComplianceSchemeRepository>();
            _mockImportRepository = new Mock<IImportRepository>();
            _mockCryptographyService = MockCyptographyService();
            _dashboardService = new DashboardService(
                _mockEngagementRepository.Object,
                _mockHostRepository.Object,
                _mockHostMapper.Object,
                _mockVulnerabilityRepository.Object,
                _mockVulnerabilityMapper.Object,
                _mockRiskRepository.Object,
                _mockCustomerRepository.Object,
                _mockGovernanceControlRepository.Object,
                _mockPhaseRepository.Object,
                _mockComplianceRepository.Object,
                _mockComplianceSchemeRepository.Object,
                _mockImportRepository.Object,
                _mockCryptographyService.Object);

            SetUpMocks();
        }

        [TestMethod]
        public void ShouldGetEngagement()
        {
            var engagementId = 1;
            var importId = 2;
            var chartSet = "dashboard";
            _importEntity.Id = importId;
            _dashboardService.Get(chartSet, engagementId);
            _mockEngagementRepository.Verify(x => x.Get(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetLatestImportByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockImportRepository.Verify(x => x.GetLatest(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetPenultimateImportByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockImportRepository.Verify(x => x.GetPenultimate(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetCustomerForEngagement()
        {
            var engagementId = 1;
            var customerId = 2;
            var importId = 3;
            var chartSet = "dashboard";
            _engagementEntity.CustomerId = customerId;
            _importEntity.Id = importId;
            _dashboardService.Get(chartSet, engagementId);
            _mockCustomerRepository.Verify(x => x.Get(customerId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetHostsByEngagement()
        {
            var engagementId = 1;
            var importId = 2;
            var chartSet = "dashboard";
            _importEntity.Id = importId;
            _dashboardService.Get(chartSet, engagementId);
            _mockHostRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetVulnerabilitiesByEngagement()
        {
            var engagementId = 1;
            var importId = 2;
            var chartSet = "dashboard";
            _importEntity.Id = importId;
            _dashboardService.Get(chartSet, engagementId);
            _mockVulnerabilityRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetRisksByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockRiskRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetGovernanceControlsByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockGovernanceControlRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetPhasesByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockPhaseRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetComplianceControlsByEngagement()
        {
            var engagementId = 1;
            var complianceSchemeId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockComplianceRepository.Verify(x => x.GetByEngagementId(engagementId, complianceSchemeId), Times.Once);
        }

        [TestMethod]
        public void ShouldGetComplianceSchemesByEngagement()
        {
            var engagementId = 1;
            var chartSet = "dashboard";
            _dashboardService.Get(chartSet, engagementId);
            _mockComplianceSchemeRepository.Verify(x => x.GetByEngagementId(engagementId), Times.Once);
        }


        private void SetUpMocks()
        {
            _engagementEntity = new EngagementEntity();
            _mockEngagementRepository.Setup(x => x.Get(It.IsAny<int>()))
                .Returns(_engagementEntity);

            _importEntity = new ImportEntity { Id = 1 };
            _mockImportRepository.Setup(x => x.GetLatest(It.IsAny<int>()))
                .Returns(_importEntity);

            _customerEntity = new CustomerEntity();
            _mockCustomerRepository.Setup(x => x.Get(It.IsAny<int>()))
                .Returns(_customerEntity);

            _riskEntities = new List<RiskEntity>
            {
                new RiskEntity
                {
                    Impact = 3,
                    Likelihood = 6,
                    FinalScore = 7
                }
            };
            _mockRiskRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_riskEntities);

            _vulnerabilityEntities = new List<VulnerabilityEntity>
            {
                new VulnerabilityEntity
                {
                    CvssScore = 1m,
                    RiskLevelBytes = Encode(ThreatLevel.High.Name)
                }
            };
            _mockVulnerabilityRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_vulnerabilityEntities);

            _hostEntities = new List<HostEntity>
            {
                new HostEntity
                {
                    OperatingSystemBytes = Encode("Operating System"),
                    HostVulnerabilities = new List<HostVulnerabilityEntity>
                    {
                        new HostVulnerabilityEntity
                        {
                            Vulnerability = new VulnerabilityEntity {CvssScore = 10m}
                        }
                    }
                }
            };
            _mockHostRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_hostEntities);

            _governanceControlEntities = new List<GovernanceControlEntity>
            {
                new GovernanceControlEntity
                {
                    ThreatLevelId = 1,
                    CmmiStatusId = 2
                }
            };
            _mockGovernanceControlRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_governanceControlEntities);

            _phaseEntities = new List<PhaseEntity>
            {
                new PhaseEntity
                {
                    Name = "Phase",
                    Risks = _riskEntities
                }
            };
            _mockPhaseRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_phaseEntities);

            _importEntities = new List<ImportEntity>
            {
                new ImportEntity
                {
                    Id = 1
                }
            };
            _mockImportRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_importEntities);

            _complianceEntities = new List<ComplianceEntity>
            {
                new ComplianceEntity
                {
                    Id = 1
                }
            };
            _mockComplianceRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(_complianceEntities);

            _complianceSchemeEntities = new List<ComplianceSchemeEntity>
            {
                new ComplianceSchemeEntity
                {
                    Id = 1
                }
            };
            _mockComplianceSchemeRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(_complianceSchemeEntities);
        }
    }
}
