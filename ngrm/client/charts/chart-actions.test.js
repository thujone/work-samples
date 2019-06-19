import moxios from 'moxios'
import * as endpoints from '../../constants/endpoints'
import * as httpStatus from '../../constants/http-status-codes'
import * as types from './chart-action-types'
import * as actions from './chart-actions'

describe('Chart Actions', () => {
  const engagementId = 'id'
  const mockResponse = 'test'
  const mockDispatch = jest.fn()

  beforeEach(() => {
    moxios.install()
    moxios.stubRequest(`${endpoints.DASHBOARD}/${engagementId}`, {
      status: httpStatus.OK,
      response: mockResponse
    })
  })

  afterEach(() => {
    moxios.uninstall()
  })

  const TEST_CASES = [
    [types.GET_DASHBOARD_CHARTS_FETCHING, types.GET_DASHBOARD_CHARTS_SUCCESS, actions.getDashboardCharts(mockDispatch)],
    [types.GET_HIPAA_CHARTS_FETCHING, types.GET_HIPAA_CHARTS_SUCCESS, actions.getHipaaCharts(mockDispatch)],
    [types.GET_COMPLIANCE_CHARTS_FETCHING, types.GET_COMPLIANCE_CHARTS_SUCCESS, actions.getComplianceCharts(mockDispatch)],
    [types.GET_HOST_CHARTS_FETCHING, types.GET_HOST_CHARTS_SUCCESS, actions.getHostCharts(mockDispatch)],
    [types.GET_VULNERABILITY_CHARTS_FETCHING, types.GET_VULNERABILITY_CHARTS_SUCCESS, actions.getVulnerabilityCharts(mockDispatch)],
    [types.GET_RISK_CHARTS_FETCHING, types.GET_RISK_CHARTS_SUCCESS, actions.getRiskCharts(mockDispatch)],
    [types.GET_GOVERNANCE_CHARTS_FETCHING, types.GET_GOVERNANCE_CHARTS_SUCCESS, actions.getGovernanceCharts(mockDispatch)]
  ].forEach(test => {
    const [fetching_type, success_type, action] = test
    it(`should ${fetching_type} then ${success_type}`, async () => {
      await action(engagementId)
      expect(mockDispatch).toHaveBeenCalledWith({ type: fetching_type })
      expect(mockDispatch).toHaveBeenCalledWith({ type: success_type, payload: mockResponse })
    })
  })
})
