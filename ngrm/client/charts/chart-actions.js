import * as types from './chart-action-types'
import * as endpoints from '../../constants/endpoints'
import axios from 'axios'

const getCharts = (dispatch, successType, chartSet, engagementId) => {
  if (!engagementId) return
  return axios.get(`${endpoints.DASHBOARD}/${chartSet}/${engagementId}`)
    .then(r => {
      dispatch({ type: successType, payload: r.data })
    })
}

export const getDashboardCharts = dispatch => (engagementId) => {
  const chartSet = 'dashboard'
  dispatch({ type: types.GET_DASHBOARD_CHARTS_FETCHING })
  
  return getCharts(dispatch, types.GET_DASHBOARD_CHARTS_SUCCESS, chartSet, engagementId)
}

export const showRisksAndVulnsChart = dispatch => () => {
  dispatch({ type: types.SHOW_RISKS_AND_VULNS_CHART })
}

export const showVulnsChart = dispatch => () => {
  dispatch({ type: types.SHOW_VULNS_CHART })
}

export const showRisksChart = dispatch => () => {
  dispatch({ type: types.SHOW_RISKS_CHART })
} 

export const showChartSwitcher = dispatch => () => {
  dispatch({ type: types.SHOW_CHART_SWITCHER })
}

export const hideChartSwitcher = dispatch => () => {
  dispatch({ type: types.HIDE_CHART_SWITCHER })
}

export const getComplianceCharts = dispatch => (engagementId, schemeId) => {
  const chartSet = 'compliance'
  dispatch({ type: types.GET_COMPLIANCE_CHARTS_FETCHING })
  return getCharts(dispatch, types.GET_COMPLIANCE_CHARTS_SUCCESS, chartSet, engagementId, schemeId)
}

export const getGovernanceCharts = dispatch => (engagementId) => {
  const chartSet = 'governance'
  dispatch({ type: types.GET_GOVERNANCE_CHARTS_FETCHING })
  return getCharts(dispatch, types.GET_GOVERNANCE_CHARTS_SUCCESS, chartSet, engagementId)
}

export const getRiskCharts = dispatch => (engagementId) => {
  const chartSet = 'risk'
  dispatch({ type: types.GET_RISK_CHARTS_FETCHING })
  return getCharts(dispatch, types.GET_RISK_CHARTS_SUCCESS, chartSet, engagementId)
}

export const getVulnerabilityCharts = dispatch => (engagementId) => {
  const chartSet = 'vulnerability'
  dispatch({ type: types.GET_VULNERABILITY_CHARTS_FETCHING })
  return getCharts(dispatch, types.GET_VULNERABILITY_CHARTS_SUCCESS, chartSet, engagementId)
}

export const getHostCharts = dispatch => (engagementId) => {
  const chartSet = 'host'
  dispatch({ type: types.GET_HOST_CHARTS_FETCHING })
  return getCharts(dispatch, types.GET_HOST_CHARTS_SUCCESS, chartSet, engagementId)
}
