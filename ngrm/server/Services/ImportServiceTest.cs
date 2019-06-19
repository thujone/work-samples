using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NGRM.Domain.Entities;
using NGRM.Domain.Interfaces.Mappers;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Model;
using NGRM.Domain.Services;

namespace NGRM.Domain.Test.Services
{
    [TestClass]
    public class ImportServiceTest : CryptographyTest
    {
        private ImportService _importService;
        private Mock<IImportRepository> _mockImportRepository;
        private Mock<IHostRepository> _mockHostRepository;
        private Mock<IVulnerabilityRepository> _mockVulnerabilityRepository;
        private Mock<IHostVulnerabilityRepository> _mockHostVulnerabilityRepository;
        private Mock<IReader> _mockCsvReader;
        private Mock<IImportMapper> _mockImportMapper;
        private Mock<IImportVulnerabilityMapper> _mockImportVulnerabilityMapper;
        private Mock<IImportHostMapper> _mockImportHostMapper;
        private List<ImportData> _importRecords;
        private Mock<ICryptographyService> _mockCryptographyService;

        [TestInitialize]
        public void SetUp()
        {
            _mockCryptographyService = MockCyptographyService();
            var mockCryptographyService = new Mock<ICryptographyService>();
            mockCryptographyService.Setup(x => x.DecryptCipherBytes(It.IsAny<byte[]>()))
                .Returns<byte[]>(x => Encoding.ASCII.GetString(x));

            _mockHostRepository = new Mock<IHostRepository>();
            _mockVulnerabilityRepository = new Mock<IVulnerabilityRepository>();
            _mockHostVulnerabilityRepository = new Mock<IHostVulnerabilityRepository>();
            _mockImportRepository = new Mock<IImportRepository>();

            _mockImportVulnerabilityMapper = new Mock<IImportVulnerabilityMapper>();
            _mockImportVulnerabilityMapper.Setup(x => x.Map(It.IsAny<ImportData>()))
                .Returns(new VulnerabilityEntity());

            _mockImportHostMapper = new Mock<IImportHostMapper>();
            _mockImportHostMapper.Setup(x => x.Map(It.IsAny<ImportData>()))
                .Returns(new HostEntity());

            _mockImportMapper = new Mock<IImportMapper>();
            _mockImportMapper.Setup(x => x.Map(It.IsAny<Import>()))
                .Returns(new ImportEntity());

            _mockCsvReader = new Mock<IReader>();
            var mockCsvFactory = new Mock<IFactory>();
            mockCsvFactory.Setup(cf => cf.CreateReader(It.IsAny<StreamReader>(), It.Is<Configuration>(x => x.Maps.Find<ImportData>() != null)))
                .Returns(_mockCsvReader.Object);

            _importRecords = BuildImportData();
            _mockCsvReader.Setup(cr => cr.GetRecords<ImportData>())
                .Returns(_importRecords);

            _mockHostRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(new List<HostEntity>());

            _mockVulnerabilityRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(new List<VulnerabilityEntity>());

            _mockHostVulnerabilityRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(new List<HostVulnerabilityEntity>());

            _importService = new ImportService(
                _mockImportRepository.Object,
                _mockHostRepository.Object,
                _mockVulnerabilityRepository.Object,
                _mockHostVulnerabilityRepository.Object,
                mockCsvFactory.Object,
                _mockImportMapper.Object,
                _mockImportVulnerabilityMapper.Object,
                _mockImportHostMapper.Object,
                _mockCryptographyService.Object);
        }

        [TestMethod]
        public void ShouldCreateVulnerabilities()
        {
            var import = new Import {File = Stream.Null};

            var result = _importService.Import(import);
            Assert.AreEqual(1, result.VulnerabilityCount);
            Assert.AreEqual(0, result.UpdatedVulnerabilityCount);
            _mockImportVulnerabilityMapper.Verify(x => x.Map(_importRecords[0], import, It.IsAny<VulnerabilityEntity>()), Times.Once);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => z.Count() == 1)), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldUpdateVulnerabilities()
        {
            _mockVulnerabilityRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(new List<VulnerabilityEntity>
                {
                    new VulnerabilityEntity {
                        PhaseId = 1,
                        TitleBytes = Encode(_importRecords[0].Title),
                        PortBytes = Encode(_importRecords[0].Port),
                        ServiceBytes = Encode(_importRecords[0].Service)
                    }
                });
            var import = new Import { PhaseId = "1", File = Stream.Null };

            var result = _importService.Import(import);
            Assert.AreEqual(0, result.VulnerabilityCount);
            Assert.AreEqual(1, result.UpdatedVulnerabilityCount);
            _mockImportVulnerabilityMapper.Verify(x => x.Map(_importRecords[0], import, It.IsAny<VulnerabilityEntity>()), Times.Once);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => z.All(y => Decode(y.Vulnerability.TitleBytes) == _importRecords[0].Title && Decode(y.Vulnerability.PortBytes) == _importRecords[0].Port && Decode(y.Vulnerability.ServiceBytes) == _importRecords[0].Service))), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldCreateHosts()
        {
            var import = new Import { File = Stream.Null };

            var result = _importService.Import(import);
            Assert.AreEqual(1, result.HostCount);
            Assert.AreEqual(0, result.UpdatedHostCount);
            _mockImportHostMapper.Verify(x => x.Map(_importRecords[0], import, It.IsAny<HostEntity>()), Times.Once);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => z.Count() == 1)), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldUpdateHosts()
        {
            _mockHostRepository.Setup(x => x.GetByEngagementId(It.IsAny<int>()))
                .Returns(new List<HostEntity>
                {
                    new HostEntity
                    {
                        PhaseId = 1,
                        IPAddressBytes = Encode(_importRecords[0].IPAddress),
                        NameBytes = Encode(_importRecords[0].HostName)
                    }
                });
            var import = new Import { PhaseId = "1", File = Stream.Null };

            var result = _importService.Import(import);
            Assert.AreEqual(0, result.HostCount);
            Assert.AreEqual(1, result.UpdatedHostCount);
            _mockImportHostMapper.Verify(x => x.Map(_importRecords[0], import, It.IsAny<HostEntity>()), Times.Once);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => z.All(y => Decode(y.Host.IPAddressBytes) == _importRecords[0].IPAddress))), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldCreateHostVulnerabilities()
        {
            _mockImportVulnerabilityMapper.Setup(x => x.Map(It.IsAny<ImportData>(), It.IsAny<Import>(), It.IsAny<VulnerabilityEntity>()))
                .Callback<ImportData, Import, VulnerabilityEntity>((x, y, z) =>
                {
                    z.TitleBytes = Encode(x.Title);
                    z.PortBytes = Encode(x.Port);
                    z.ServiceBytes = Encode(x.Service);
                });
            _mockImportHostMapper.Setup(x => x.Map(It.IsAny<ImportData>(), It.IsAny<Import>(), It.IsAny<HostEntity>()))
                .Callback<ImportData, Import, HostEntity>((x, y, z) =>
                {
                    z.IPAddressBytes = Encode(x.IPAddress);
                    z.NameBytes = Encode(x.HostName);
                });

            _importRecords.Clear();
            _importRecords.Add(new ImportData {IPAddress = "1", HostName = "Host1", Title = "A", Port ="80", Service = "ServiceName"});
            _importRecords.Add(new ImportData {IPAddress = "1", HostName = "Host1", Title = "B", Port ="80", Service = "ServiceName"});
            _importRecords.Add(new ImportData {IPAddress = "1", HostName = "Host3", Title = "B", Port ="80", Service = "ServiceName"});
            _importRecords.Add(new ImportData {IPAddress = "2", HostName = "Host2", Title = "A", Port ="80", Service = "ServiceName"});
            _importRecords.Add(new ImportData {IPAddress = "2", HostName = "Host2", Title = "A", Port ="8080", Service = "ServiceName"});
            _importRecords.Add(new ImportData {IPAddress = "2", HostName = "Host3", Title = "A", Port ="8080", Service = "ServiceName"});
            // add duplicate row
            _importRecords.Add(new ImportData {IPAddress = "2", HostName = "Host2", Title = "A", Port ="8080", Service = "ServiceName"});
            var import = new Import { File = Stream.Null };

            _importService.Import(import);
            Expression<Func<IEnumerable<HostVulnerabilityEntity>, bool>> expression = z =>
                z.Count() == 6 &&
                z.Select(y => y.Vulnerability).Distinct().Count() == 3 &&
                z.Select(y => y.Host).Distinct().Count() == 4;
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is(expression)), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldNeverUpdateHostVulnerabilities()
        {
            var engagementId = 12;
            _mockHostVulnerabilityRepository.Setup(x => x.GetByEngagementId(engagementId))
                .Returns(new List<HostVulnerabilityEntity>
                {
                    new HostVulnerabilityEntity
                    {
                        Host = new HostEntity
                        {
                            PhaseId = 1,
                            IPAddressBytes = Encode(_importRecords[0].IPAddress),
                            NameBytes = Encode(_importRecords[0].HostName)
                        },
                        Vulnerability = new VulnerabilityEntity
                        {
                            PhaseId = 1,
                            TitleBytes = Encode(_importRecords[0].Title),
                            PortBytes = Encode(_importRecords[0].Port),
                            ServiceBytes = Encode(_importRecords[0].Service)
                        }
                    }
                });
            var import = new Import
            {
                EngagementId = engagementId.ToString(),
                PhaseId = "1",
                File = Stream.Null
            };

            _importService.Import(import);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => !z.Any())), Times.Never);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        [TestMethod]
        public void ShouldUpdateHostVulnerabilitiesForPhase()
        {
            var engagementId = 12;
            var phaseId = 1;
            _mockHostVulnerabilityRepository.Setup(x => x.GetByEngagementId(engagementId))
                .Returns(new List<HostVulnerabilityEntity>
                {
                    new HostVulnerabilityEntity
                    {
                        Host = new HostEntity
                        {
                            PhaseId = phaseId,
                            IPAddressBytes = Encode(_importRecords[0].IPAddress)
                        },
                        Vulnerability = new VulnerabilityEntity
                        {
                            PhaseId = phaseId,
                            TitleBytes = Encode(_importRecords[0].Title),
                            PortBytes = Encode(_importRecords[0].Port),
                            ServiceBytes = Encode(_importRecords[0].Service)
                        }
                    }
                });
            var import = new Import
            {
                EngagementId = engagementId.ToString(),
                PhaseId = "2", // != phaseId
                File = Stream.Null
            };

            _importService.Import(import);
            _mockHostVulnerabilityRepository.Verify(x => x.AddRange(It.Is<IEnumerable<HostVulnerabilityEntity>>(z => z.Count() == 1)), Times.Once);
            _mockHostVulnerabilityRepository.Verify(r => r.Save(), Times.Once);
        }

        private List<ImportData> BuildImportData()
        {
            return new List<ImportData> {
                new ImportData
                {
                    IPAddress = "10.1.1.241",
                    HostName = "Host 1",
                    Title = "Title 1",
                    Port = "80",
                    Service = "Service 1"
                }
            };
        }


    }
}
