import * as types from './compliance-action-types'
import reducer from './compliance-add-form-ui-reducer'

describe('Compliance Add Form UI Reducer', () => {

  it('should handle COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING', () => {
    const action = {
      type: types.COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING
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

  it('should handle COMPLIANCE_SCHEMES_ADD_FAILED', () => {
    const action = {
      type: types.COMPLIANCE_SCHEMES_ADD_FAILED,
      error: {
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

})
