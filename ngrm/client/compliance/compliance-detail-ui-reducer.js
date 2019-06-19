import * as types from './compliance-action-types'

export const initState = {
  ValidationErrors: {},
  showRemediationDatePicker: false
}

const complianceDetailUIReducer = (state = initState, action) => {
  switch (action.type) {
    case types.COMPLIANCE_GET_FETCHING:
      return {
        ...state,
        ValidationErrors: {}
      }
    case types.COMPLIANCE_POST_FAILED:
      return {
        ...state,
        ValidationErrors: action.validationErrors
      }
    case types.COMPLIANCE_MITIGATION_DATE_CLICK:
      return {
        ...state,
        showRemediationDatePicker: !state.showRemediationDatePicker
      }
    case types.COMPLIANCE_MITIGATION_DATE_SELECTED:
    case types.COMPLIANCE_MITIGATION_DATE_CLOSE:
      return {
        ...state,
        showRemediationDatePicker: false
      }
    default:
      return state
  }
}

export default complianceDetailUIReducer