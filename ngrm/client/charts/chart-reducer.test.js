import * as types from './chart-action-types'
import reducer, { initState } from './chart-reducer'

describe('Chart Reducer', () => {
  const mockPayload = {
    RiskGauge: 'riskGauge',
    RiskScore: 'riskScore',
    ComplianceHipaaByGapReview: 'gapReview',
    ComplianceHipaaByMaturityLevel: 'maturityLevel',
    HostsByOperatingSystem: 'operatingSystem',
    VulnerabilitiesByCategory: 'category',
    VulnerabilitiesBySeverity: 'severity',
    Vulnerabilities: 'vulnerabilities',
    RiskByImpact: 'impact',
    RiskByLikelihood: 'likelihood',
    RiskByPhase: 'phase',
    RiskByScore: 'score',
    RiskScoreByPhase: 'phaseScore',
    TopRiskByScore: {
      Series: [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }]
    },
    GovernanceControlsByMaturityLevel: 'maturityLevel',
    GovernanceControlsByRiskLevel: 'riskLevel',
    MitigationSummaryRisks: 'mitigationSummaryRisks',
    MitigationSummaryRisksByPhase: 'mitigationSummaryRisksByPhase',
    MitigationSummaryRisksAndVulns: 'mitigationSummaryRisksAndVulns'
  }

  const TEST_CASES = [
    [types.GET_DASHBOARD_CHARTS_FETCHING, 'dashboard', {}],
    [types.GET_DASHBOARD_CHARTS_SUCCESS, 'dashboard', {
      riskGaugeChart: mockPayload.RiskGauge,
      riskScore: mockPayload.RiskScore,
      mitigationSummaryChart: mockPayload.MitigationSummaryRisks,
      mitigationSummaryRisksByPhase: mockPayload.MitigationSummaryRisksByPhase,
      mitigationSummaryRisksAndVulns: mockPayload.MitigationSummaryRisksAndVulns
    }],
    [types.GET_HIPAA_CHARTS_FETCHING, 'hipaa', {}],
    [types.GET_HIPAA_CHARTS_SUCCESS, 'hipaa', {
      byGapReviewChart: mockPayload.ComplianceHipaaByGapReview,
      byMaturityLevelChart: mockPayload.ComplianceHipaaByMaturityLevel
    }],
    [types.GET_HOST_CHARTS_FETCHING, 'hosts', {}],
    [types.GET_HOST_CHARTS_SUCCESS, 'hosts', {
      byOperatingSystemChart: mockPayload.HostsByOperatingSystem
    }],
    [types.GET_VULNERABILITY_CHARTS_FETCHING, 'vulnerabilities', {}],
    [types.GET_VULNERABILITY_CHARTS_SUCCESS, 'vulnerabilities', {
      vulnerabilityChart: mockPayload.Vulnerabilities
    }],
    [types.GET_RISK_CHARTS_FETCHING, 'risks', {}],
    [types.GET_RISK_CHARTS_SUCCESS, 'risks', {
      byImpactChart: mockPayload.RiskByImpact,
      byLikelihoodChart: mockPayload.RiskByLikelihood,
      byPhaseChart: mockPayload.RiskByPhase,
      byScoreChart: mockPayload.RiskByScore,
      byPhaseScoreChart: mockPayload.RiskScoreByPhase,
      byTopScoreChart: { Series: [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }] }
    }],
    [types.GET_GOVERNANCE_CHARTS_FETCHING, 'governance', {}],
    [types.GET_GOVERNANCE_CHARTS_SUCCESS, 'governance', {
      byMaturityLevelChart: mockPayload.GovernanceControlsByMaturityLevel,
      byThreatLevelChart: mockPayload.GovernanceControlsByRiskLevel
    }],
  ].forEach(test => {
    const [action_type, key, expected_value] = test
    it(`should handle ${action_type}`, () => {
      const action = { type: action_type, payload: mockPayload }
      const state = { ...initState, [key]: 'value' }
      const nextState = reducer(initState, action)
      expect(nextState[key]).toEqual(expected_value)
    })
  })

  it('should not handle random action', () => {
    const action = {
      type: 'ABCD',
      value: 'riskScore'
    }
    const initState = {
    }
    const expectedState = {
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

})
