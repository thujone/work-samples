using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using NGRM.Domain.Entities;
using NGRM.Domain.Interfaces.Mappers;
using NGRM.Domain.Interfaces.Repositories;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Lookups;
using NGRM.Domain.Model;

namespace NGRM.Domain.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IEngagementRepository _engagementRepository;
        private readonly IHostRepository _hostRepository;
        private readonly IHostMapper _hostMapper;
        private readonly IVulnerabilityRepository _vulnerabilityRepository;
        private readonly IVulnerabilityMapper _vulnerabilityMapper;
        private readonly IRiskRepository _riskRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IGovernanceControlRepository _governanceControlRepository;
        private readonly IPhaseRepository _phaseRepository;
        private readonly IImportRepository _importRepository;
        private readonly IComplianceRepository _complianceRepository;
        private readonly IComplianceSchemeRepository _complianceSchemeRepository;
        private readonly ICryptographyService _cryptographyService;
        private readonly IEngagementService _engagementService;

        public DashboardService(
            IEngagementRepository engagementRepository,
            IHostRepository hostRepository,
            IHostMapper hostMapper,
            IVulnerabilityRepository vulnerabilityRepository,
            IVulnerabilityMapper vulnerabilityMapper,
            IRiskRepository riskRepository,
            ICustomerRepository customerRepository,
            IGovernanceControlRepository governanceControlRepository,
            IPhaseRepository phaseRepository,
            IComplianceRepository complianceRepository,
            IComplianceSchemeRepository complianceSchemeRepository,
            IImportRepository importRepository,
            ICryptographyService cryptographyService,
            IEngagementService engagementService)
        {
            _engagementRepository = engagementRepository;
            _customerRepository = customerRepository;
            _hostRepository = hostRepository;
            _hostMapper = hostMapper;
            _vulnerabilityRepository = vulnerabilityRepository;
            _vulnerabilityMapper = vulnerabilityMapper;
            _riskRepository = riskRepository;
            _governanceControlRepository = governanceControlRepository;
            _phaseRepository = phaseRepository;
            _complianceRepository = complianceRepository;
            _complianceSchemeRepository = complianceSchemeRepository;
            _importRepository = importRepository;
            _cryptographyService = cryptographyService;
            _engagementService = engagementService;
        }

        public Dashboard Get(string chartSet, int engagementId)
        {
            var dashboard = new Dashboard();

            if (_engagementService.Get(engagementId) == null)
                return dashboard;

            var engagement = _engagementRepository.Get(engagementId);
            var customer = _customerRepository.Get(engagement.CustomerId);
        
            var latestImportId = _importRepository.GetLatest(engagementId)?.Id;
            var penultimateImportId = _importRepository.GetPenultimate(engagementId)?.Id;

            MapEngagement(engagement, dashboard);
            MapCustomer(customer, dashboard);

            if (chartSet == "dashboard")
            {
                var phaseEntities = _phaseRepository.GetByEngagementId(engagementId).ToList();
                var riskEntities = _riskRepository.GetByEngagementId(engagementId).ToList();

                MapRiskGauge(engagement, dashboard);                
                MapMitigationSummaryVulnsByRisk(riskEntities, dashboard);
                MapMitigationSummaryRisksByPhase(phaseEntities, dashboard);
                MapMitigationSummaryRisksAndVulns(engagementId, riskEntities, phaseEntities, dashboard);
            }

            else if (chartSet == "compliance")
            {
                foreach(var complianceScheme in _complianceSchemeRepository.GetByEngagementId(engagementId))
                {
                    var complianceEntities = _complianceRepository.GetByEngagementId(engagementId, complianceScheme.Id).ToList();

                    MapComplianceByGapReview(complianceEntities, complianceScheme, dashboard);
                    MapComplianceByMaturityLevel(complianceEntities, complianceScheme, dashboard);
                }
            }

            else if (chartSet == "governance")
            {
                var governanceControlEntities = _governanceControlRepository.GetByEngagementId(engagementId).ToList();

                MapGovernanceControlsByRiskLevel(governanceControlEntities, dashboard);
                MapGovernanceControlsByMaturityLevel(governanceControlEntities, dashboard);
            }

            else if (chartSet == "risk")
            {
                var riskEntities = _riskRepository.GetByEngagementId(engagementId).ToList();

                MapRiskByImpact(riskEntities, dashboard);
                MapRiskByLikelihood(riskEntities, dashboard);
                MapRiskByScore(riskEntities, dashboard);
                MapRiskByPhase(riskEntities, dashboard);
                MapTopRiskByScore(riskEntities, dashboard);
            }

            else if (chartSet == "host")
            {
                var hostEntities = _hostRepository.GetByEngagementId(engagementId).ToList();

                MapHostsByOperatingSystem(hostEntities, dashboard);
            }

            else if (chartSet == "vulnerability")
            {
                var vulnerabilityEntities = _vulnerabilityRepository.GetByEngagementId(engagementId).ToList();

                MapVulnerabilitiesBySeverity(vulnerabilityEntities, dashboard);
                MapVulnerabilitiesByCategory(vulnerabilityEntities, dashboard, latestImportId);
                MapVulnerabilities(vulnerabilityEntities, dashboard);
            }

            else if (chartSet == "risk")
            {
                var phaseEntities = _phaseRepository.GetByEngagementId(engagementId).ToList();

                MapRiskScoreByPhase(phaseEntities, dashboard);
            }

            return dashboard;
        }

        //TODO: Create dashboard mapper to encapsulate mapping logic
        private void MapHostsByOperatingSystem(List<HostEntity> hostEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();

            // TODO: Make more efficient? Either filter on the repository level or use Queryable clauses instead of this tedious mapping
            List<HostEntity> hostEntitiesToKeep = new List<HostEntity>();
            foreach (var hostEntity in hostEntities) {
                var host = _hostMapper.Map(hostEntity);

                List<HostVulnerabilityEntity> hostVulnerabilitiesToKeep = new List<HostVulnerabilityEntity>();
                foreach (var hostVulnerability in hostEntity.HostVulnerabilities) {
                    hostVulnerabilitiesToKeep.Add(hostVulnerability);
                }
                hostEntity.HostVulnerabilities = hostVulnerabilitiesToKeep;
                hostEntitiesToKeep.Add(hostEntity);
            }

            Func<HostEntity, ThreatLevel> averageSeverity = v => v.HostVulnerabilities.Any() ? ThreatLevel.LookupByValue(v.HostVulnerabilities.Average(x => x.Vulnerability.CvssScore)) : ThreatLevel.VeryLow;
            var hostVulnerabilitySeverityGroups = hostEntitiesToKeep.OrderBy(averageSeverity).GroupBy(averageSeverity).ToList();
            foreach (var hostVulnerabilitySeverityGroup in hostVulnerabilitySeverityGroups)
            {
                var series = new Series
                {
                    Name = hostVulnerabilitySeverityGroup.Key.Name,
                    Color = hostVulnerabilitySeverityGroup.Key.Color
                };

                Func<HostEntity, string> operatingSystem = v =>
                {
                    var os = Decrypt<string>(v.OperatingSystemBytes) ?? string.Empty;
                    return os.Contains(' ') ? os.Substring(0, os.IndexOf(' ')) : os;
                };
                var vulnerabilitySeverityOperatingSystemGroups = hostVulnerabilitySeverityGroup.OrderBy(operatingSystem).GroupBy(operatingSystem).ToList();
                foreach (var vulnerabilitySeverityOperatingSystemGroup in vulnerabilitySeverityOperatingSystemGroups)
                {
                    var data = new Data
                    {
                        Name = vulnerabilitySeverityOperatingSystemGroup.Key,
                        Value = vulnerabilitySeverityOperatingSystemGroup.Count(),
                        Color = hostVulnerabilitySeverityGroup.Key.Color,
                        Drilldown = hostVulnerabilitySeverityGroup.Key.Name + "-" + vulnerabilitySeverityOperatingSystemGroup.Key
                    };
                    series.Data.Add(data);

                    var hostVulnerabilityOperatingSystemGroups = vulnerabilitySeverityOperatingSystemGroup.OrderBy(v => Decrypt<string>(v.OperatingSystemBytes)).GroupBy(v => Decrypt<string>(v.OperatingSystemBytes)).ToList();
                    if (hostVulnerabilityOperatingSystemGroups.Any())
                    {
                        var drilldownSeries = new Series
                        {
                            Name = $"{hostVulnerabilitySeverityGroup.Key.Name} ({vulnerabilitySeverityOperatingSystemGroup.Key})",
                            Id = hostVulnerabilitySeverityGroup.Key.Name + "-" + vulnerabilitySeverityOperatingSystemGroup.Key
                        };

                        foreach (var vulnerabilityOperatingSystemGroup in hostVulnerabilityOperatingSystemGroups)
                        {
                            var drilldownData = new Data
                            {
                                Name = vulnerabilityOperatingSystemGroup.Key,
                                Value = vulnerabilityOperatingSystemGroup.Select(x => Decrypt<string>(x.IPAddressBytes)).Distinct().Count()
                            };
                            drilldownSeries.Data.Add(drilldownData);
                        }
                        highchart.DrilldownSeries.Add(drilldownSeries);
                    }
                }
                highchart.Series.Add(series);
            }

            dashboard.HostsByOperatingSystem = highchart;
        }

        private void MapVulnerabilitiesBySeverity(List<VulnerabilityEntity> vulnerabilityEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Severity"
            };
            var vulnerabilitySeverityGroups = vulnerabilityEntities.OrderByDescending(v => v.CvssScore).GroupBy(v => ThreatLevel.LookupByValue(v.CvssScore)).ToList();
            foreach (var vulnerabilitySeverityGroup in vulnerabilitySeverityGroups)
            {
                var data = new Data
                {
                    Name = vulnerabilitySeverityGroup.Key.Name,
                    Value = vulnerabilitySeverityGroup.Count(),
                    Color = vulnerabilitySeverityGroup.Key.Color,
                    Drilldown = vulnerabilitySeverityGroup.Key.Name
                };
                series.Data.Add(data);

                var vulnerabilitySeverityCategoryGroups = vulnerabilitySeverityGroup.OrderBy(v => v.VulnerabilityCategory).GroupBy(v => v.VulnerabilityCategory).ToList();
                if (vulnerabilitySeverityCategoryGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = vulnerabilitySeverityGroup.Key.Name,
                        Id = vulnerabilitySeverityGroup.Key.Name
                    };

                    foreach (var vulnerabilitySeverityCategoryGroup in vulnerabilitySeverityCategoryGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = vulnerabilitySeverityCategoryGroup.Key,
                            Value = vulnerabilitySeverityCategoryGroup.Count()
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }
            highchart.Series.Add(series);

            dashboard.VulnerabilitiesBySeverity = highchart;
        }

        private void MapVulnerabilitiesByCategory(List<VulnerabilityEntity> vulnerabilityEntities, Dashboard dashboard, int? importId)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Name = "Categories"
            };

            // TODO: Make more efficient? Either filter by importId on the repository level or use Queryable clauses instead of this tedious mapping
            List<VulnerabilityEntity> vulnerabilityEntitiesToKeep = new List<VulnerabilityEntity>();
            foreach (var vulnerabilityEntity in vulnerabilityEntities) {
                var vulnerability = _vulnerabilityMapper.Map(vulnerabilityEntity);

                List<HostVulnerabilityEntity> hostVulnerabilitiesToKeep = new List<HostVulnerabilityEntity>();
                foreach (var hostVulnerability in vulnerabilityEntity.HostVulnerabilities) {
                    if (hostVulnerability.ImportId == importId)
                        hostVulnerabilitiesToKeep.Add(hostVulnerability);
                }
                vulnerabilityEntity.HostVulnerabilities = hostVulnerabilitiesToKeep;
                if (vulnerabilityEntity.HostVulnerabilities.Count > 0)
                    vulnerabilityEntitiesToKeep.Add(vulnerabilityEntity);
            }

            var vulnerabilityCategoryGroups = vulnerabilityEntitiesToKeep.OrderBy(v => v.VulnerabilityCategory).GroupBy(v => v.VulnerabilityCategory).ToList();
            foreach (var vulnerabilityCategoryGroup in vulnerabilityCategoryGroups)
            {
                var data = new Data
                {
                    Name = vulnerabilityCategoryGroup.Key,
                    Value = vulnerabilityCategoryGroup.Count(),
                    Drilldown = vulnerabilityCategoryGroup.Key
                };
                series.Data.Add(data);

                //Order By Asc so that the severity levels will be drawn from low to high (left to right)
                var vulnerabilityCategorySeverityGroups = vulnerabilityCategoryGroup.OrderBy(v => v.CvssScore).GroupBy(v => ThreatLevel.LookupByValue(v.CvssScore)).ToList();
                if (vulnerabilityCategorySeverityGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = vulnerabilityCategoryGroup.Key,
                        Id = vulnerabilityCategoryGroup.Key
                    };

                    foreach (var vulnerabilityCategorySeverityGroup in vulnerabilityCategorySeverityGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = vulnerabilityCategorySeverityGroup.Key.Name,
                            Value = vulnerabilityCategorySeverityGroup.Count(),
                            Color = vulnerabilityCategorySeverityGroup.Key.Color
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }
            highchart.Series.Add(series);

            dashboard.VulnerabilitiesByCategory = highchart;
        }

        private void MapVulnerabilities(List<VulnerabilityEntity> vulnerabilityEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();

            // TODO: Make more efficient? Either filter by importId on the repository level or use Queryable clauses instead of this tedious mapping
            List<VulnerabilityEntity> vulnerabilityEntitiesToKeep = new List<VulnerabilityEntity>();
            foreach (var vulnerabilityEntity in vulnerabilityEntities) {
                var vulnerability = _vulnerabilityMapper.Map(vulnerabilityEntity);

                List<HostVulnerabilityEntity> hostVulnerabilitiesToKeep = new List<HostVulnerabilityEntity>();
                foreach (var hostVulnerability in vulnerabilityEntity.HostVulnerabilities) {
                    hostVulnerabilitiesToKeep.Add(hostVulnerability);
                }
                vulnerabilityEntity.HostVulnerabilities = hostVulnerabilitiesToKeep;
                vulnerabilityEntitiesToKeep.Add(vulnerabilityEntity);
            }

            var threatLevelGroups = vulnerabilityEntitiesToKeep
                .OrderBy(x => x.CvssScore)
                .GroupBy(x => ThreatLevel.LookupByValue(x.CvssScore));

            foreach (var threatLevelGroup in threatLevelGroups)
            {
                var threatLevel = new Series
                {
                    Name = threatLevelGroup.Key.Name,
                    Color = threatLevelGroup.Key.Color
                };

                var categories = threatLevelGroup
                    .OrderBy(v => v.VulnerabilityCategory)
                    .GroupBy(v => v.VulnerabilityCategory)
                    .Select(x => new Data
                    {
                        Name = x.Key,
                        Value = x.Count(),
                        Color = threatLevelGroup.Key.Color
                    });

                threatLevel.Data.AddRange(categories);
                highchart.Series.Add(threatLevel);
            }

            dashboard.Vulnerabilities = highchart;
        }

        private void MapRiskByImpact(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Impact"
            };
            var riskSeverityGroups = riskEntities.OrderBy(r => r.Impact).GroupBy(r => ThreatLevel.LookupByValue(r.Impact)).ToList();
            foreach (var riskSeverityGroup in riskSeverityGroups)
            {
                var data = new Data
                {
                    Name = riskSeverityGroup.Key.Name,
                    Value = riskSeverityGroup.Count(),
                    Color = riskSeverityGroup.Key.Color,
                    Drilldown = riskSeverityGroup.Key.Name
                };
                series.Data.Add(data);

                var riskSeverityPhaseGroups = riskSeverityGroup.OrderBy(r => r.Phase?.DisplayOrder).GroupBy(r => r.Phase ?? new PhaseEntity { Name = "Unknown" }).ToList();
                if (riskSeverityPhaseGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = riskSeverityGroup.Key.Name,
                        Id = riskSeverityGroup.Key.Name
                    };

                    foreach (var riskSeverityPhaseGroup in riskSeverityPhaseGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = riskSeverityPhaseGroup.Key.Name,
                            Value = riskSeverityPhaseGroup.Count()
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }
            highchart.Series.Add(series);

            dashboard.RiskByImpact = highchart;
        }

        private void MapRiskByLikelihood(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Likelihood"
            };
            var riskSeverityGroups = riskEntities.OrderBy(r => r.Likelihood).GroupBy(r => ThreatLevel.LookupByValue(r.Likelihood)).ToList();
            foreach (var riskSeverityGroup in riskSeverityGroups)
            {
                var data = new Data
                {
                    Name = riskSeverityGroup.Key.Name,
                    Value = riskSeverityGroup.Count(),
                    Color = riskSeverityGroup.Key.Color,
                    Drilldown = riskSeverityGroup.Key.Name
                };
                series.Data.Add(data);

                var riskSeverityPhaseGroups = riskSeverityGroup.OrderBy(r => r.Phase?.DisplayOrder).GroupBy(r => r.Phase ?? new PhaseEntity { Name = "Unknown" }).ToList();
                if (riskSeverityPhaseGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = riskSeverityGroup.Key.Name,
                        Id = riskSeverityGroup.Key.Name
                    };

                    foreach (var riskSeverityPhaseGroup in riskSeverityPhaseGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = riskSeverityPhaseGroup.Key.Name,
                            Value = riskSeverityPhaseGroup.Count()
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }
            highchart.Series.Add(series);

            dashboard.RiskByLikelihood = highchart;
        }

        private void MapRiskByPhase(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Name = "Phases"
            };

            var riskSeverityGroups = riskEntities.OrderBy(r => r.Phase?.DisplayOrder).GroupBy(r => r.Phase ?? new PhaseEntity { Name = "Unknown" }).ToList();
            foreach (var riskPhaseGroup in riskSeverityGroups)
            {
                var data = new Data
                {
                    Name = riskPhaseGroup.Key.Name,
                    Value = riskPhaseGroup.Count(),
                    Drilldown = riskPhaseGroup.Key.Name
                };
                series.Data.Add(data);

                //Order By Asc so that the severity levels will be drawn from low to high (left to right)
                var riskSeverityPhaseGroups = riskPhaseGroup.OrderBy(r => r.FinalScore).GroupBy(r => ThreatLevel.LookupByValue(r.FinalScore)).ToList();
                if (riskSeverityPhaseGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = riskPhaseGroup.Key.Name,
                        Id = riskPhaseGroup.Key.Name
                    };

                    foreach (var riskSeverityPhaseGroup in riskSeverityPhaseGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = riskSeverityPhaseGroup.Key.Name,
                            Value = riskSeverityPhaseGroup.Count(),
                            Color = riskSeverityPhaseGroup.Key.Color
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }

            highchart.Series.Add(series);
            dashboard.RiskByPhase = highchart;
        }

        private void MapRiskByScore(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Score"
            };
            var riskSeverityGroups = riskEntities.OrderBy(r => r.FinalScore).GroupBy(r => ThreatLevel.LookupByValue(r.FinalScore)).ToList();
            foreach (var riskSeverityGroup in riskSeverityGroups)
            {
                var data = new Data
                {
                    Name = riskSeverityGroup.Key.Name,
                    Value = riskSeverityGroup.Count(),
                    Color = riskSeverityGroup.Key.Color,
                    Drilldown = riskSeverityGroup.Key.Name
                };
                series.Data.Add(data);

                var riskSeverityPhaseGroups = riskSeverityGroup.OrderBy(r => r.Phase?.DisplayOrder).GroupBy(r => r.Phase ?? new PhaseEntity { Name = "Unknown" }).ToList();
                if (riskSeverityPhaseGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = riskSeverityGroup.Key.Name,
                        Id = riskSeverityGroup.Key.Name
                    };

                    foreach (var riskSeverityPhaseGroup in riskSeverityPhaseGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = riskSeverityPhaseGroup.Key.Name,
                            Value = riskSeverityPhaseGroup.Count()
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }
            highchart.Series.Add(series);

            dashboard.RiskByScore = highchart;
        }

        private void MapTopRiskByScore(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Name = "Risks"
            };
            var risksByScoreDescending = riskEntities.OrderByDescending(r => r.FinalScore).ThenBy(r => Decrypt<string>(r.NameBytes)).ToList();
            for (var index = 0; index < risksByScoreDescending.Count; index++)
            {
                var riskEntity = risksByScoreDescending[index];
                var data = new Data
                {
                    Id = riskEntity.Id.ToString(),
                    Name = $"{index + 1}. {Decrypt<string>(riskEntity.NameBytes)}", //include index so that duplicate names will be displayed
                    Value = riskEntity.FinalScore.GetValueOrDefault(),
                    Color = ThreatLevel.LookupByValue(riskEntity.FinalScore).Color,
                    SeverityName = ThreatLevel.LookupByValue(riskEntity.FinalScore).Name
                };
                series.Data.Add(data);
            }
            highchart.Series.Add(series);

            dashboard.TopRiskByScore = highchart;
        }

        public void MapRiskGauge(EngagementEntity engagementEntity, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Severity",
                InnerSize = "70%"
            };

            dashboard.RiskScore = engagementEntity.RiskScore?.ToString("N1") ?? "N/A";

            Func<ThreatLevel, decimal?, List<Data>> buildData = (threatLevel, nextThreatLevelValue) =>
            {
                var dataSlices = new List<Data>();
                for (var slice = threatLevel.Value; slice < nextThreatLevelValue; slice += 0.1m)
                {
                    dataSlices.Add(new Data
                    {
                        Name = 5 == slice ? ThreatLevel.LookupByValue(engagementEntity.RiskScore).Name : string.Empty,
                        Color = engagementEntity.RiskScore >= slice ? threatLevel.Color : "#eee",
                        Value = 0.1m
                    });
                }
                return dataSlices;
            };

            series.Data.AddRange(buildData(ThreatLevel.VeryLow, ThreatLevel.Low.Value));
            series.Data.AddRange(buildData(ThreatLevel.Low, ThreatLevel.Moderate.Value));
            series.Data.AddRange(buildData(ThreatLevel.Moderate, ThreatLevel.High.Value));
            series.Data.AddRange(buildData(ThreatLevel.High, ThreatLevel.VeryHigh.Value));
            series.Data.AddRange(buildData(ThreatLevel.VeryHigh, 10m));
            highchart.Series.Add(series);

            dashboard.RiskGauge = highchart;
        }

        private void MapMitigationSummaryVulnsByRisk(List<RiskEntity> riskEntities, Dashboard dashboard)
        {
            var highcharts = new Dictionary<int, Highchart>();

            // The first item should always be "All Risks" -- a complete list of unique RiskVulns from all the risks together.
            // Build up a list of RiskVulns
            var allRiskVulns = new List<RiskVulnerabilityEntity>();
            foreach (var riskEntity in riskEntities)
            {                
                allRiskVulns.AddRange(riskEntity.RiskVulnerabilities);
            }
            
            // Create a new RiskEntity for our "All Risks" chart
            var allRisksEntity = new RiskEntity();
            allRisksEntity.Id = 0;
            allRisksEntity.NameBytes = Encrypt("All Risks");

            // Add the complete list of distinct RiskVulns to the new RiskEntity
            allRisksEntity.RiskVulnerabilities = allRiskVulns.ToList();

            // Unshift the "All Risks" RiskEntity onto the beginning of our array of risks
            riskEntities.Insert(0, allRisksEntity);

            // Now we can create our array of Highcharts
            foreach (var riskEntity in riskEntities)
            {
                var highchart = new NamedHighchart();

                var vulnerabilitiesByThreatLevel = riskEntity.RiskVulnerabilities
                    .Select(x => x.Vulnerability)
                    .OrderBy(x => x.CvssScore)
                    .GroupBy(x => ThreatLevel.LookupByValue(x.CvssScore))
                    .ToList();

                // Skip this risk entity if there are no vulns associated with it
                if (vulnerabilitiesByThreatLevel.Count == 0) {
                    continue;
                }

                // Add each Severity bar in our three-bar columns (Moderate Severity, High Severity, Very High Severity)
                foreach (var threatLevelGroup in vulnerabilitiesByThreatLevel)
                {
                    var series = new Series
                    {
                        Name = threatLevelGroup.Key.Name + " Severity",
                        Color = threatLevelGroup.Key.Color
                    };

                    // Guard against the Remediation Status being null
                    var defaultStatusValue = MitigationStatus.NotMitigated.Value;

                    // Add the data for each Remediation Status (Not Mitigated, Mitigation in Progress, etcetera)
                    foreach (var status in MitigationStatus.List)
                    {
                        var data = new Data
                        {
                            Name = status.Name,
                            Value = threatLevelGroup.Count(x => (x.RemediationStatusId ?? defaultStatusValue) == status.Value),
                            Color = threatLevelGroup.Key.Color
                        };

                        series.Data.Add(data);
                    }

                    highchart.Series.Add(series);
                }

                // Decrypt the risk name and assign it as the title of the Highchart
                highchart.Name = Decrypt<string>(riskEntity.NameBytes);
                highcharts.Add(riskEntity.Id, highchart);
            }

            dashboard.MitigationSummaryRisks = highcharts;
        }

        private void MapMitigationSummaryRisksByPhase(List<PhaseEntity> phaseEntities, Dashboard dashboard)
        {
            var highcharts = new Dictionary<int, Highchart>();
            var chartPhases = phaseEntities.ToList();

            // The first item should always be "All Phases" -- a complete list of Risks from all the Phases together.
            // Build up a list of RiskEntities
            var risksForAllPhases = chartPhases.SelectMany(cp => cp.Risks).ToList();
            
            // Create a new chartPhase for our "All Phases" chart
            var allPhasesEntity = new PhaseEntity();
            allPhasesEntity.Id = 0;
            allPhasesEntity.Name = "All Phases";

            // Add the complete list of distinct RiskEntities to the new chartPhase
            allPhasesEntity.Risks = risksForAllPhases.Distinct().ToList();

            // Unshift the "All Phases" chartPhase onto the beginning of our array of ChartPhases
            chartPhases.Insert(0, allPhasesEntity);

            // Now we can create our array of Highcharts
            foreach (var chartPhase in chartPhases)
            {
                var highchart = new NamedHighchart();

                var risksByThreatLevel = chartPhase.Risks
                    .OrderBy(x => x.FinalScore)
                    .GroupBy(x => ThreatLevel.LookupByValue(x.FinalScore))
                    .ToList();

                // Skip this risk entity if there are no vulns associated with it 
                if (risksByThreatLevel.Count == 0) {
                    continue;
                }

                // Add each Severity bar in our three-bar columns (Moderate Severity, High Severity, Very High Severity)
                foreach (var threatLevelGroup in risksByThreatLevel)
                {
                    var series = new Series
                    {
                        Name = threatLevelGroup.Key.Name + " Severity",
                        Color = threatLevelGroup.Key.Color
                    };

                    // Guard against the Remediation Status being null
                    var defaultStatusValue = MitigationStatus.NotMitigated.Value;

                    // Add the data for each Remediation Status (Not Mitigated, Mitigation in Progress, etcetera)
                    foreach (var status in MitigationStatus.List)
                    {
                        var data = new Data
                        {
                            Name = status.Name,
                            Value = threatLevelGroup.Count(x => (x.RemediationStatusId ?? defaultStatusValue) == status.Value),
                            Color = threatLevelGroup.Key.Color
                        };

                        series.Data.Add(data);
                    }

                    highchart.Series.Add(series);
                }

                // Decrypt the risk name and assign it as the title of the Highchart
                highchart.Name = chartPhase.Name;
                highcharts.Add(chartPhase.Id, highchart);
            }

            dashboard.MitigationSummaryRisksByPhase = highcharts;
        }

        private void MapMitigationSummaryRisksAndVulns(int engagementId, List<RiskEntity> riskEntities, List<PhaseEntity> phaseEntities, Dashboard dashboard)
        {
            var highcharts = new Dictionary<int, Highchart>();
            var chartPhases = phaseEntities.ToList();

            // The first item should always be "All Phases" -- a complete list of Risks from all the Phases together.
            // Build up a list of RiskEntities
            var risksForAllPhases = new List<RiskEntity>();
            foreach (var chartPhase in chartPhases)
            {                
                foreach (var riskEntity in chartPhase.Risks)
                {
                    risksForAllPhases.Add(riskEntity); 
                }
            }

            var vulnsForAllPhases = new List<VulnerabilityEntity>();
            
            vulnsForAllPhases = _vulnerabilityRepository.GetByEngagementId(engagementId).ToList();

           // Create a new chartPhase for our "All Phases" chart
            var allPhasesEntity = new PhaseEntity();
            allPhasesEntity.Id = 0;
            allPhasesEntity.Name = "All Phases";

            // Add the complete list of  RiskEntities to the new chartPhase
            allPhasesEntity.Risks = risksForAllPhases.ToList();
            allPhasesEntity.Vulnerabilities = vulnsForAllPhases.ToList();

            // Unshift the "All Phases" chartPhase onto the beginning of our array of chartPhases
            chartPhases.Insert(0, allPhasesEntity);

            // Now we can create our array of Highcharts
            foreach (var chartPhase in chartPhases)
            {
                var highchart = new NamedHighchart();

                var risksSeries = new Series
                {
                    YAxis = 1,
                    Name = "Risks",
                    Color = "rgb(241,194,34)",
                    Type = "spline"
                };

                var vulnsSeries = new Series
                {
                    Name = "Vulnerabilities",
                    Color = "#009ac7",
                    Type = "column"
                };

                var vulnsByPhase = vulnsForAllPhases.Where(x => x.PhaseId == chartPhase.Id).ToList();

                if (chartPhase.Risks.Count == 0 && vulnsByPhase.Count == 0)
                {
                    continue;
                }

                var defaultStatusValue = MitigationStatus.NotMitigated.Value;

                foreach (var status in MitigationStatus.List)
                {
                    var risksByMitigationStatusCount = chartPhase.Risks.Count(x => x.RemediationStatusId == status.Value);
                    var vulnsByMitigationStatusCount = vulnsByPhase.Count(x => x.RemediationStatusId == status.Value);
                    if (chartPhase.Id == 0)
                        vulnsByMitigationStatusCount = vulnsForAllPhases.Count(x => x.RemediationStatusId == status.Value);
                    var risksData = new Data
                    {
                        Name = status.Name,
                        Value = risksByMitigationStatusCount,
                        Color = "rgb(241,194,34)"
                    };

                    var vulnsData = new Data
                    {
                        Name = status.Name,
                        Value = vulnsByMitigationStatusCount,
                        Color = "#009ac7"
                    };
                    vulnsSeries.Data.Add(vulnsData);
                    risksSeries.Data.Add(risksData);
                }

                highchart.Series.Add(vulnsSeries);
                highchart.Series.Add(risksSeries);

                // Decrypt the risk name and assign it as the title of the Highchart
                highchart.Name = chartPhase.Name;
                highcharts.Add(chartPhase.Id, highchart);
            }

            dashboard.MitigationSummaryRisksAndVulns = highcharts;
        }

        private void MapEngagement(EngagementEntity engagementEntity, Dashboard dashboard)
        {
            dashboard.Status = EngagementStatus.LookupByValue(engagementEntity.EngagementStatusId)?.Name;
            dashboard.ExternalKickoffDate = engagementEntity.ExternalKickoffDate?.ToString("M/d/yyyy");
            dashboard.DeliverableDueDate = engagementEntity.DeliverableDueDate?.ToString("M/d/yyyy");
            dashboard.EngagementManager = engagementEntity.EngagementManager;
        }

        private void MapCustomer(CustomerEntity customerEntity, Dashboard dashboard)
        {
            dashboard.CustomerName = Decrypt<string>(customerEntity.NameBytes);
            dashboard.CustomerIndustry = Industry.LookupByValue(customerEntity.IndustryId.GetValueOrDefault())?.Name;
            dashboard.CustomerAccountManager = Decrypt<string>(customerEntity.AccountManagerBytes);
            dashboard.CustomerRegion = Region.LookupByValue(customerEntity.RegionId.GetValueOrDefault())?.Name;
        }

        private void MapGovernanceControlsByRiskLevel(List<GovernanceControlEntity> governanceControlEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Risk Level"
            };

            var governanceControlGroups = governanceControlEntities.OrderBy(gc => gc.ThreatLevelId).GroupBy(gc => ThreatLevel.LookupByValue(gc.ThreatLevelId)).ToList();
            foreach (var governanceControlGroup in governanceControlGroups)
            {
                var data = new Data
                {
                    Name = governanceControlGroup.Key.Name,
                    Value = governanceControlGroup.Count(),
                    Color = governanceControlGroup.Key.Color
                };
                series.Data.Add(data);
            }

            highchart.Series.Add(series);

            dashboard.GovernanceControlsByRiskLevel = highchart;
        }

        private void MapGovernanceControlsByMaturityLevel(List<GovernanceControlEntity> governanceControlEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Maturity Level"
            };

            var governanceControlGroups = governanceControlEntities.OrderBy(gc => gc.CmmiStatusId).GroupBy(gc => CmmiStatus.LookupByValue(gc.CmmiStatusId)).ToList();
            foreach (var governanceControlGroup in governanceControlGroups)
            {
                var data = new Data
                {
                    Name = governanceControlGroup.Key.Name,
                    Value = governanceControlGroup.Count(),
                    Color = governanceControlGroup.Key.Color
                };
                series.Data.Add(data);
            }

            highchart.Series.Add(series);

            dashboard.GovernanceControlsByMaturityLevel = highchart;
        }

        private void MapRiskScoreByPhase(List<PhaseEntity> phaseEntities, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Name = "Phases"
            };

            foreach (var phaseEntity in phaseEntities)
            {
                var data = new Data
                {
                    Name = phaseEntity.Name,
                    Value = phaseEntity.RiskScore ?? 0,
                    Drilldown = phaseEntity.Name,
                    Color = ThreatLevel.LookupByValue(phaseEntity.RiskScore).Color
                };
                series.Data.Add(data);

                //Order By Asc so that the severity levels will be drawn from low to high (left to right)
                var riskSeverityPhaseGroups = phaseEntity.Risks.OrderBy(r => r.FinalScore).GroupBy(r => ThreatLevel.LookupByValue(r.FinalScore)).ToList();
                if (riskSeverityPhaseGroups.Any())
                {
                    var drilldownSeries = new Series
                    {
                        Name = phaseEntity.Name,
                        Id = phaseEntity.Name
                    };

                    foreach (var riskSeverityPhaseGroup in riskSeverityPhaseGroups)
                    {
                        var drilldownData = new Data
                        {
                            Name = riskSeverityPhaseGroup.Key.Name,
                            Value = riskSeverityPhaseGroup.Count(),
                            Color = riskSeverityPhaseGroup.Key.Color
                        };
                        drilldownSeries.Data.Add(drilldownData);
                    }
                    highchart.DrilldownSeries.Add(drilldownSeries);
                }
            }

            highchart.Series.Add(series);

            dashboard.RiskScoreByPhase = highchart;
        }

        private void MapComplianceByGapReview(List<ComplianceEntity> complianceEntities, ComplianceSchemeEntity scheme, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Compliance"
            };

            var gapReviewGroups = complianceEntities.OrderBy(x => x.CompliantStatusId).GroupBy(x => CompliantStatus.LookupByValue(x.CompliantStatusId) ?? CompliantStatus.Unknown).ToList();
            foreach (var gapReviewGroup in gapReviewGroups)
            {
                var data = new Data
                {
                    Name = gapReviewGroup.Key.Name,
                    Value = gapReviewGroup.Count(),
                    Color = gapReviewGroup.Key.Color
                };
                series.Data.Add(data);
            }

            highchart.Series.Add(series);

            dashboard.ComplianceByGapReview[scheme.Id] = highchart;
        }

        private void MapComplianceByMaturityLevel(List<ComplianceEntity> complianceEntities, ComplianceSchemeEntity scheme, Dashboard dashboard)
        {
            var highchart = new Highchart();
            var series = new Series
            {
                Type = "pie",
                Name = "Maturity Level"
            };

            var maturityLevelGroups = complianceEntities.OrderBy(x => x.CmmiStatusId).GroupBy(gc => CmmiStatus.LookupByValue(gc.CmmiStatusId)).ToList();
            foreach (var maturityLevelGroup in maturityLevelGroups)
            {
                var data = new Data
                {
                    Name = maturityLevelGroup.Key.Name,
                    Value = maturityLevelGroup.Count(),
                    Color = maturityLevelGroup.Key.Color
                };
                series.Data.Add(data);
            }

            highchart.Series.Add(series);

            dashboard.ComplianceByMaturityLevel[scheme.Id] = highchart;
        }

        private byte[] Encrypt<T>(T value)
        {
            var converter = TypeDescriptor.GetConverter(typeof(T));
            var text = converter.ConvertToInvariantString(value);
            return _cryptographyService.EncryptPlainText(text);
        }

        private T Decrypt<T>(byte[] cipherBytes)
        {
            var value = _cryptographyService.DecryptCipherBytes(cipherBytes);
            if (value == null)
                return default(T);

            var converter = TypeDescriptor.GetConverter(typeof(T));
            return (T)converter.ConvertFromInvariantString(value);
        }
    }
}
