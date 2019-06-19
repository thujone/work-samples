import { connect } from 'react-redux'
import { fetchTable } from '../components/table/fetch-table'
import ComplianceGrid from './compliance-grid'
import * as actions from './compliance-actions'


const mapStateToProps = state => {
  return {
    selectedEngagement: state.branding.selectedEngagement,
    entitlements: state.session.entitlements.list['complianceRoles'] || {},
    schemeId: state.schemeId,
    compliance: state.compliance,
    charts: state.charts.compliance || {}
  }
}


const mapDispatchToProps = dispatch => ({
  actions: {
    handleUpload: actions.handleUpload(dispatch)
  }
})


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const schemeId = ownProps.match.params.schemeId
  var byGapReviewChart = null;
  var byMaturityLevelChart = null;

  if(stateProps.charts.byGapReviewChart !== undefined && stateProps.charts.byMaturityLevelChart)
  {
    byGapReviewChart = stateProps.charts.byGapReviewChart[schemeId]
    byMaturityLevelChart = stateProps.charts.byMaturityLevelChart[schemeId]
  }

  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    engagementId: stateProps.selectedEngagement || ownProps.match.params.engagementId,
    schemeId: schemeId,
    tabs: stateProps.tab || ownProps.match.params.tabs,
    charts: {
      byGapReviewChart: byGapReviewChart,
      byMaturityLevelChart: byMaturityLevelChart
    }
  })
}

export const ComplianceGridContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(fetchTable('compliance')(ComplianceGrid))

export default ComplianceGridContainer
