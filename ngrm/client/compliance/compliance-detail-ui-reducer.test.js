import * as types from './compliance-action-types'
import reducer from './compliance-detail-ui-reducer'

describe('Compliance Detail UI Reducer', () => {
  it('should handle COMPLIANCE_GET_FETCHING', () => {
    const action = {
      type: types.COMPLIANCE_GET_FETCHING
    }
    const initState = {
      ValidationErrors: {
        Field: ['error']
      }
    }
    const expectedState = {
      ValidationErrors: {}
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_POST_FAILED', () => {
    const action = {
      type: types.COMPLIANCE_POST_FAILED,
      validationErrors: {
        Field: ['error']
      }
    }
    const initState = {
      ValidationErrors: { }
    }
    const expectedState = {
      ValidationErrors: {
        Field: ['error']
      }
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_MITIGATION_DATE_CLICK', () => {
    const action = {
      type: types.COMPLIANCE_MITIGATION_DATE_CLICK
    }
    const initState = {
      showRemediationDatePicker: false
    }
    const expectedState = {
      showRemediationDatePicker: true
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_MITIGATION_DATE_CLOSE', () => {
    const action = {
      type: types.COMPLIANCE_MITIGATION_DATE_CLOSE
    }
    const initState = {
      showRemediationDatePicker: true
    }
    const expectedState = {
      showRemediationDatePicker: false
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_MITIGATION_DATE_SELECTED', () => {
    const action = {
      type: types.COMPLIANCE_MITIGATION_DATE_SELECTED
    }
    const initState = {
      showRemediationDatePicker: true
    }
    const expectedState = {
      showRemediationDatePicker: false
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })
})