import { connect } from 'react-redux'
import ComplianceAddForm from './compliance-add-form'
import * as actions from './compliance-actions'

const mapStateToProps = state => {
  return {
    engagementId: state.branding.selectedEngagement,
    entitlements: state.session.entitlements.list['complianceRoles'] || {},
    ui: state.ui.complianceAddForm
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
      addComplianceScheme: actions.addComplianceScheme(dispatch)
  }
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    engagementId: stateProps.engagementId || ownProps.match.params.engagementId,
    schemeId: ownProps.match.params.schemeId
  })
}

export const ComplianceAddFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ComplianceAddForm)

export default ComplianceAddFormContainer
