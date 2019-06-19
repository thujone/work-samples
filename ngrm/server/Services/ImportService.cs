using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration;
using NGRM.Domain.Entities;
using NGRM.Domain.Interfaces.Mappers;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Lookups;
using NGRM.Domain.Model;
using NGRM.Domain.Utils;

namespace NGRM.Domain.Services
{
    public class ImportService : IImportService
    {
        private readonly IFactory _csvFactory;
        private readonly IImportMapper _importMapper;
        private readonly IImportVulnerabilityMapper _importVulnerabilityMapper;
        private readonly IImportHostMapper _importHostMapper;
        private readonly ICryptographyService _cryptographyService;
        private readonly IImportRepository _importRepository;
        private readonly IHostRepository _hostRepository;
        private readonly IVulnerabilityRepository _vulnerabilityRepository;
        private readonly IHostVulnerabilityRepository _hostVulnerabilityRepository;

        public ImportService(
            IImportRepository importRepository,
            IHostRepository hostRepository,
            IVulnerabilityRepository vulnerabilityRepository,
            IHostVulnerabilityRepository hostVulnerabilityRepository,
            IFactory csvFactory,
            IImportMapper importMapper,
            IImportVulnerabilityMapper importVulnerabilityMapper,
            IImportHostMapper importHostMapper,
            ICryptographyService cryptographyService)
        {
            _csvFactory = csvFactory;
            _importMapper = importMapper;
            _importVulnerabilityMapper = importVulnerabilityMapper;
            _importHostMapper = importHostMapper;
            _cryptographyService = cryptographyService;
            _importRepository = importRepository;
            _hostRepository = hostRepository;
            _vulnerabilityRepository = vulnerabilityRepository;
            _hostVulnerabilityRepository = hostVulnerabilityRepository;
        }

        public ImportResult Import(Import import)
        {
            var csvConfiguration = new Configuration();
            csvConfiguration.RegisterClassMap(new ImportDataMap());
            csvConfiguration.MissingFieldFound = null;

            // Get all the records out of the CSV file
            List<ImportData> importRecords;
            bool isDescription = true;

            // Special validation for Verbiage and Description
            using (var reader = _csvFactory.CreateReader(new StreamReader(import.File), csvConfiguration))
            {
                reader.Read();
                reader.ReadHeader();
                List<string> headers = reader.Context.HeaderRecord.ToList();
                                            
                if (headers.Contains("Finding (Verbiage)") && headers.Contains("Finding (Description)") )
                {
                    throw new ArgumentException("You can't have both Verbiage and Description columns.");
                }
                else if (headers.Contains("Finding (Verbiage)"))
                {
                    isDescription = false;
                }

                reader.Configuration.UnregisterClassMap();

                if (!isDescription)
                {
                    reader.Configuration.RegisterClassMap(new ImportVerbiageDataMap());
                }
                else
                {
                    reader.Configuration.RegisterClassMap(new ImportDataMap());
                }

                List<ImportData> records = reader.GetRecords<ImportData>().ToList();
                importRecords = records;
            }
        
            // Get engagement ID and phase ID
            int engagementId = Convert.ToInt32(import.EngagementId);
            var phaseId = Convert.ToInt32(import.PhaseId);

            // Create and save import entity
            var importEntity = _importMapper.Map(import);
            importEntity.ImportedDate = DateTime.Now;
            importEntity.AssessmentDate = DateTime.Now;  // TODO: AssessmentDate will eventually be entered in by the user
            _importRepository.Add(importEntity);
            _importRepository.Save();
            _importMapper.Map(importEntity, import);
            
            // Use this to store HostVulnerabilities and display them properly after importing those rows
            var importId = importEntity.Id;
            var penultimateImportId = _importRepository.GetPenultimate(engagementId)?.Id ?? null;

            // Get all existing hosts for this engagement and phase
            // Hosts and Vulnerabilities records must be unique (per phase), and so they're only imported once (per phase).
            // Hence, we do not need to worry about the import ID for Hosts and Vulnerabilities.
            var hostEntities = _hostRepository
                .GetByEngagementId(engagementId)
                .Where(x => x.PhaseId == phaseId)
                .ToList();
            var hostsToAdd = new List<HostEntity>();
            var hostsToUpdate = new List<HostEntity>();
 
            // Get all existing vulns for this engagement and phase
            var vulnerabilityEntities = _vulnerabilityRepository
                .GetByEngagementId(engagementId)
                .Where(x => x.PhaseId == phaseId)
                .ToList();
            var vulnerabilitiesToAdd = new List<VulnerabilityEntity>();
            var vulnerabilitiesToUpdate = new List<VulnerabilityEntity>();

            // Get all existing hostVulnerabilities for this engagement and phase
            var hostVulnerabilityEntities = _hostVulnerabilityRepository
                .GetByEngagementId(engagementId)
                .Where(x => x.Vulnerability.PhaseId == phaseId && x.Host.PhaseId == phaseId && x.ImportId == importId)
                .ToList();
            var hostVulnerabilitiesToAdd = new List<HostVulnerabilityEntity>();
            var hostVulnerabilitiesToUpdate = new List<HostVulnerabilityEntity>();

            // Iterate through each CSV record, grouped by Finding ("Title")
            var hostVulnerabilityImportGroups = importRecords.GroupBy(x => new {x.Title, x.Port, x.Service, x.IPAddress, x.HostName});

            foreach (var importRecordGroup in hostVulnerabilityImportGroups)
            {
                // Encrypt sensitive fields
                var titleBytes = Encrypt(importRecordGroup.Key.Title);
                var portBytes = Encrypt(int.Parse(importRecordGroup.Key.Port));
                var serviceBytes = Encrypt(importRecordGroup.Key.Service);
                var ipAddressBytes = Encrypt(importRecordGroup.Key.IPAddress);
                var hostNameBytes = Encrypt(importRecordGroup.Key.HostName);
                var firstImportRecordGroup = importRecordGroup.First();

                // Create or update a vulnerability entity for this CSV record
                // NOTE: All imports share a single set of unique vulnerabilities
                var vulnerabilityEntity = AddOrUpdateEntity(
                    x => x.TitleBytes.SequenceEqual(titleBytes) &&
                    x.PortBytes.SequenceEqual(portBytes) &&
                    x.ServiceBytes.SequenceEqual(serviceBytes),
                    vulnerabilityEntities,
                    vulnerabilitiesToAdd,
                    vulnerabilitiesToUpdate);
                vulnerabilityEntity.IsStatusUnknown = false;
                if (vulnerabilityEntity.IsHistorical)
                {
                    vulnerabilityEntity.IsHistorical = false;
                    vulnerabilityEntity.RemediationStatusId = 1; // MitigationStatus.NotMitigated.Value;
                    vulnerabilityEntity.MitigatedDate = null;
                }

                // RemediationStatusId is technically a nullable field, but upon import we should always
                // set a default of NotMitigated.
                if (vulnerabilityEntity.RemediationStatusId == null)
                    vulnerabilityEntity.RemediationStatusId = 1; //MitigationStatus.NotMitigated.Value;
                
                _importVulnerabilityMapper.Map(firstImportRecordGroup, import, vulnerabilityEntity);

                // Create or update a host for this CSV record
                // NOTE: All imports in a phase share a single set of unique hosts
                var hostEntity = AddOrUpdateEntity(
                    x => x.IPAddressBytes.SequenceEqual(ipAddressBytes) &&
                    x.NameBytes.SequenceEqual(hostNameBytes),
                    hostEntities,
                    hostsToAdd,
                    hostsToUpdate);
                hostEntity.Status = "Active";
                hostEntity.PhaseId = phaseId;
                _importHostMapper.Map(firstImportRecordGroup, import, hostEntity);

                // Create a partially-encrypted hostVuln for this CSV record
                // NOTE: HostVulnerabilities are always added as new records during the import process
                AddEntity(
                    x => x.Vulnerability.TitleBytes.SequenceEqual(titleBytes) &&
                        x.Vulnerability.PortBytes.SequenceEqual(portBytes) &&
                        x.Vulnerability.ServiceBytes.SequenceEqual(serviceBytes) &&
                        x.Host.IPAddressBytes.SequenceEqual(ipAddressBytes) &&
                        x.Host.NameBytes.SequenceEqual(hostNameBytes),
                    hostVulnerabilityEntities,
                    hostVulnerabilitiesToAdd,
                    hostVulnerabilitiesToUpdate,
                    CreateHostVulnerability(engagementId, phaseId, hostEntity, vulnerabilityEntity, importEntity));
            }

            // Write new HostVulnerabilities to the database
            if (hostVulnerabilitiesToAdd.Any())
            {
                _hostVulnerabilityRepository.AddRange(hostVulnerabilitiesToAdd);
            }
            _hostVulnerabilityRepository.Save();
            _hostRepository.Save();
            _vulnerabilityRepository.Save();

            // Determine status of every host entity
            var hostsToAddOrUpdate = hostsToAdd.Union(hostsToUpdate).ToArray();
            var hostsToMarkOffline = hostEntities.Except(hostsToAddOrUpdate);

            // Another pass through the host entities is required to figure out which hosts are missing, i.e., 'Offline'
            foreach (var hostEntity in hostEntities)
            {
                // TODO offline vs. retired
                if (hostsToMarkOffline.Contains(hostEntity))
                    hostEntity.Status = "Offline";
                else if (hostsToAddOrUpdate.Contains(hostEntity))
                    hostEntity.Status = "Active";
            }

            // Do a vuln delta check between latest and penultimate imports and adjust vuln remediation metadata
            var vulnerabilityEntitiesToAdd = ProcessVulnerabilityChanges(
                hostVulnerabilityEntities,
                vulnerabilityEntities,
                hostEntities,
                importId,
                penultimateImportId,
                phaseId,
                importEntity.AssessmentDate);

            // Save Hosts and Vulnerabilities
            _hostVulnerabilityRepository.Save();
            _hostRepository.Save();
            _vulnerabilityRepository.Save();

            // Return vuln and host insert and update counts
            return new ImportResult(vulnerabilitiesToAdd.Count, vulnerabilitiesToUpdate.Count, hostsToAdd.Count, hostsToUpdate.Count);
        }

        private List<VulnerabilityEntity> ProcessVulnerabilityChanges(
            List<HostVulnerabilityEntity> hostVulnerabilityEntities,
            List<VulnerabilityEntity> vulnerabilityEntities,
            List<HostEntity> hostEntities,
            int? latestImportId,
            int? penultimateImportId,
            int phaseId,
            DateTime? assessmentDate)
        {
            if (latestImportId == null || penultimateImportId == null)
                return vulnerabilityEntities;

            var latestHostVulns = _hostVulnerabilityRepository
                .GetByImportAndPhase(latestImportId.Value, phaseId)
                .ToList();
            var penultimateHostVulns = _hostVulnerabilityRepository
                .GetByImportAndPhase(penultimateImportId.Value, phaseId)
                .ToList();

            // Get the list of HostVulns that are missing from the latest import
            var missingHostVulns = new List<HostVulnerabilityEntity>();
            foreach (var penultimateHostVuln in penultimateHostVulns)
            {
                if (!latestHostVulns.Any(c => c.VulnerabilityId == penultimateHostVuln.VulnerabilityId))
                    missingHostVulns.Add(penultimateHostVuln);
            }

            // Check each missing HostVuln to see if the Host exists in the latest import
            foreach (var missingHostVuln in missingHostVulns)
            {

                var vulnerabilityEntity = vulnerabilityEntities
                     .Where(v => v.Id == missingHostVuln.VulnerabilityId)
                     .FirstOrDefault();
                     
                if (vulnerabilityEntity != null)
                {
                    var index = vulnerabilityEntities.IndexOf(vulnerabilityEntity);
                    var isRemediable = true;

                    foreach (var hv in vulnerabilityEntity.HostVulnerabilities)
                    {
                        // If we can't find this vulnerability in any other host in the HostVuln list,
                        // then we don't know if all hosts are present (i.e., not "on vacation") for this particular scan
                        if (!latestHostVulns.Any(x => x.HostId == hv.HostId && x.VulnerabilityId != hv.VulnerabilityId))
                        {
                            isRemediable = false;
                            break;
                        }
                    }

                    // If we've been able to verify that all the hosts related to this vuln are present in the scan,
                    // then we can go ahead and mark the missing vuln as remediated
                    if (isRemediable)
                    {
                        // Set mitigation status to "Fully Mitigated"
                        vulnerabilityEntity.RemediationStatusId = 4; //MitigationStatus.FullyMitigated.Value;

                        // Set Mitigated Date to the date of the assessment
                        if (vulnerabilityEntity.MitigatedDate == null && assessmentDate != null) {
                            vulnerabilityEntity.MitigatedDate = assessmentDate;
                            vulnerabilityEntity.IsStatusUnknown = false;
                            vulnerabilityEntity.IsHistorical = true;
                        }
                    }
                    else
                    {
                        vulnerabilityEntity.IsStatusUnknown = true;
                        vulnerabilityEntity.IsHistorical = false;
                    }

                    // Replace old entity with modified entity
                    vulnerabilityEntities[index] = vulnerabilityEntity;
                }
            }

            return vulnerabilityEntities;
        }

        private TEntity GetEntity<TEntity>(Func<TEntity, bool> predicate, List<TEntity> persistedEntities, List<TEntity> entitiesToAdd)
            where TEntity : class
        {
            return persistedEntities.FirstOrDefault(predicate) ??
                entitiesToAdd.FirstOrDefault(predicate);
        }

        // 
        private TEntity AddEntity<TEntity>(Func<TEntity, bool> predicate, List<TEntity> persistedEntities,
        List<TEntity> entitiesToAdd, List<TEntity> entitiesToUpdate, TEntity newEntity = null)
            where TEntity : class, new()
        {
            var entity = GetEntity(predicate, persistedEntities, entitiesToAdd);
            entity = newEntity ?? new TEntity();
            entitiesToAdd.Add(entity);
            return entity;
        }

        // Same method is used across different entities
        private TEntity AddOrUpdateEntity<TEntity>(Func<TEntity, bool> predicate, List<TEntity> persistedEntities,
        List<TEntity> entitiesToAdd, List<TEntity> entitiesToUpdate, TEntity newEntity = null)
            where TEntity : class, new()
        {
            var entity = GetEntity(predicate, persistedEntities, entitiesToAdd);

            // Distinguish between needing to update an existing entity or to add a new entity
            if (entity != null)
            {
                entitiesToUpdate.Add(entity);
                return entity;
            }

            entity = newEntity ?? new TEntity();
            entitiesToAdd.Add(entity);
            return entity;
        }

        private HostVulnerabilityEntity CreateHostVulnerability(
            int engagementId,
            int phaseId,
            HostEntity hostEntity,
            VulnerabilityEntity vulnerabilityEntity, 
            ImportEntity importEntity)
        {
            return new HostVulnerabilityEntity
            {
                EngagementId = engagementId,
                PhaseId = phaseId,
                Host = hostEntity,
                Vulnerability = vulnerabilityEntity,
                Import = importEntity
            };
        }

        private byte[] Encrypt<T>(T value)
        {
            var converter = TypeDescriptor.GetConverter(typeof(T));
            var text = converter.ConvertToInvariantString(value);
            return _cryptographyService.EncryptPlainText(text);
        }
    }
}
