import { connect } from 'react-redux'
import wrapper from '../components/will-mount-wrapper'
import * as actions from './compliance-actions'
import ComplianceDetail from './compliance-detail'

const mapStateToProps = state => {
  return {
    engagementId: state.branding.selectedEngagement,
    compliance: state.complianceDetail,
    ui: state.ui.complianceDetail,
    entitlements: state.session.entitlements.list['complianceRoles'] || {}
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    handleCmmiStatusChange: actions.handleCmmiStatusChange(dispatch),
    handleCompliantStatusChange: actions.handleCompliantStatusChange(dispatch),
    handleSectionTitleChange: actions.handleSectionTitleChange(dispatch),
    handleRuleChange: actions.handleRuleChange(dispatch),
    handleSubsectionTitleChange: actions.handleSubsectionTitleChange(dispatch),
    handleSubsectionTextChange: actions.handleSubsectionTextChange(dispatch),
    handleImplementationChange: actions.handleImplementationChange(dispatch),
    handleImplementationSpecificTextChange: actions.handleImplementationSpecificTextChange(dispatch),
    handleCurrentStateChange: actions.handleCurrentStateChange(dispatch),
    handleReferenceNotesChange: actions.handleReferenceNotesChange(dispatch),
    handleRemediationNotesChange: actions.handleRemediationNotesChange(dispatch),
    handleRemediationStatusChange: actions.handleRemediationStatusChange(dispatch),
    handleMitigationDateChange: actions.handleMitigationDateChange(dispatch),
    handleMitigationDateSelected: actions.handleMitigationDateSelected(dispatch),
    handleMitigationDateClick: actions.handleMitigationDateClick(dispatch),
    handleMitigationDateClose: actions.handleMitigationDateClose(dispatch),
    handleResourceAssignSave: actions.handleResourceAssignSave(dispatch),
    update: actions.update(dispatch)
  },
  willMount: props => actions.get(dispatch)(props.engagementId, props.match.params.schemeId, props.match.params.complianceId, props.location)
})

const mergeProps = (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, stateProps, dispatchProps, ownProps)

export const ComplianceDetailContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapper(ComplianceDetail))

export default ComplianceDetailContainer
