import * as types from './chart-action-types'

const initState = {
  dashboard: {},
  hipaa: {},
  hosts: {},
  vulnerabilities: {},
  risks: {},
  governance: {}
}

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.GET_DASHBOARD_CHARTS_FETCHING:
      return {
        ...state,
        dashboard: {}
      }
    case types.GET_DASHBOARD_CHARTS_SUCCESS:
      return {
        ...state,
        dashboard: {
          riskGaugeChart: action.payload.RiskGauge,
          riskScore: action.payload.RiskScore,
          mitigationSummaryChart: action.payload.MitigationSummaryRisks,
          mitigationSummaryRisksByPhase: action.payload.MitigationSummaryRisksByPhase,
          mitigationSummaryRisksAndVulns: action.payload.MitigationSummaryRisksAndVulns,
          showRisksAndVulnsChart: true,
          showRisksChart: false,
          showVulnsChart: false,
          showChartSwitcher: false
        }
      }
    case types.SHOW_RISKS_AND_VULNS_CHART:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showChartSwitcher: false,
          showRisksAndVulnsChart: true,
          showVulnsChart: false,
          showRisksChart: false
        }
      }
    case types.SHOW_VULNS_CHART:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showChartSwitcher: false,
          showRisksAndVulnsChart: false,
          showVulnsChart: true,
          showRisksChart: false
        }
      }
    case types.SHOW_RISKS_CHART:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showChartSwitcher: false,
          showRisksAndVulnsChart: false,
          showVulnsChart: false,
          showRisksChart: true
        }
      }
    case types.SHOW_CHART_SWITCHER:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showChartSwitcher: true
        }
      }
    case types.HIDE_CHART_SWITCHER:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showChartSwitcher: false
        }
      }
    case types.GET_HIPAA_CHARTS_FETCHING:
      return {
        ...state,
        hipaa: {}
      }
    case types.GET_HIPAA_CHARTS_SUCCESS:
      return {
        ...state,
        hipaa: {
          byGapReviewChart: action.payload.ComplianceHipaaByGapReview,
          byMaturityLevelChart: action.payload.ComplianceHipaaByMaturityLevel
        }
      }
    case types.GET_COMPLIANCE_CHARTS_FETCHING:
      return {
        ...state,
        compliance: {}
      }
    case types.GET_COMPLIANCE_CHARTS_SUCCESS:
      return {
        ...state,
        compliance: {
          byGapReviewChart: action.payload.ComplianceByGapReview,
          byMaturityLevelChart: action.payload.ComplianceByMaturityLevel
        }
      }
    case types.GET_HOST_CHARTS_FETCHING:
      return {
        ...state,
        hosts: {}
      }
    case types.GET_HOST_CHARTS_SUCCESS:
      return {
        ...state,
        hosts: {
          byOperatingSystemChart: action.payload.HostsByOperatingSystem
        }
      }
    case types.GET_VULNERABILITY_CHARTS_FETCHING:
      return {
        ...state,
        vulnerabilities: {}
      }
    case types.GET_VULNERABILITY_CHARTS_SUCCESS:
      return {
        ...state,
        vulnerabilities: {
          vulnerabilityChart: action.payload.Vulnerabilities
        }
      }
    case types.GET_RISK_CHARTS_FETCHING:
      return {
        ...state,
        risks: {}
      }
    case types.GET_RISK_CHARTS_SUCCESS:
      let topRisks = action.payload.TopRisksByScore;
      let topRisksSeries;
      let topRisksSlice;
      if (topRisks && topRisks.Series[0] && topRisks.Series[0].data) {
        topRisksSeries = topRisks.Series[0]
        topRisksSlice = topRisksSeries.data.slice(0, 10)
      } else {
        topRisksSeries = [];
        topRisksSlice = [];
      }
      return {
        ...state,
        risks: {
          byImpactChart: action.payload.RiskByImpact,
          byLikelihoodChart: action.payload.RiskByLikelihood,
          byPhaseChart: action.payload.RiskByPhase,
          byScoreChart: action.payload.RiskByScore,
          byPhaseScoreChart: action.payload.RiskScoreByPhase,
          byTopScoreChart: {
            ...topRisks,
            Series: [{
              ...topRisksSeries,
              data: topRisksSlice
            }]
          }
        }
      }
    case types.GET_GOVERNANCE_CHARTS_FETCHING:
      return {
        ...state,
        governance: {}
      }
    case types.GET_GOVERNANCE_CHARTS_SUCCESS:
      return {
        ...state,
        governance: {
          byMaturityLevelChart: action.payload.GovernanceControlsByMaturityLevel,
          byThreatLevelChart: action.payload.GovernanceControlsByRiskLevel
        }
      }
    default:
      return state
  }
}

export default reducer
