import * as types from './compliance-action-types'

export const initState = {
  ValidationErrors: {}
}

const complianceAddFormUIReducer = (state = initState, action) => {
  switch (action.type) {
    case types.COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING:
      return {
        ...state,
        ValidationErrors: {}
      }
    case types.COMPLIANCE_SCHEMES_ADD_FAILED:
      return {
        ...state,
        ValidationErrors: action.error
      }
    default:
      return state
  }
}

export default complianceAddFormUIReducer
