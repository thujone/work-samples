import { connect } from 'react-redux'
import Dashboard from './dashboard'
import * as chartActions from '../components/charts/chart-actions'

const mapStateToProps = state => {
  return {
    selectedEngagement: state.branding.selectedEngagement,
    dashboard: state.dashboard,
    ui: state.ui.dashboard,
    charts: state.charts.dashboard
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      getDashboardCharts: chartActions.getDashboardCharts(dispatch),
      showRisksAndVulnsChart: chartActions.showRisksAndVulnsChart(dispatch),
      showVulnsChart: chartActions.showVulnsChart(dispatch),
      showRisksChart: chartActions.showRisksChart(dispatch),
      showChartSwitcher: chartActions.showChartSwitcher(dispatch),
      hideChartSwitcher: chartActions.hideChartSwitcher(dispatch)
    }
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    engagementId: stateProps.selectedEngagement || ownProps.match.params.engagementId
  })
}

export const DashboardContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Dashboard)

export default DashboardContainer
