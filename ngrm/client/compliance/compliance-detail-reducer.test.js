import * as types from './compliance-action-types'
import reducer from './compliance-detail-reducer'

describe('Compliance Detail Reducer', () => {
  it('should handle COMPLIANCE_GET_SUCCESS', () => {
    const action = {
      type: types.COMPLIANCE_GET_SUCCESS,
      payload: {data: 'value'}
    }
    const initState = {
    }
    const expectedState = {
      data: 'value'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_POST_FETCHING', () => {
    const action = {
      type: types.COMPLIANCE_POST_FETCHING
    }
    const initState = {
    }
    const expectedState = {
      IsFetching: true
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_POST_SUCCESS', () => {
    const action = {
      type: types.COMPLIANCE_POST_SUCCESS
    }
    const initState = {
    }
    const expectedState = {
      IsFetching: false
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_POST_FAILED', () => {
    const action = {
      type: types.COMPLIANCE_POST_FAILED
    }
    const initState = {
    }
    const expectedState = {
      IsFetching: false
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_CMMI_STATUS_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_CMMI_STATUS_CHANGE,
      value: 'CMMIStatus'
    }
    const initState = {
    }
    const expectedState = {
      CmmiStatusId: 'CMMIStatus'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_COMPLIANT_STATUS_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_COMPLIANT_STATUS_CHANGE,
      value: 'CompliantStatus'
    }
    const initState = {
    }
    const expectedState = {
      CompliantStatusId: 'CompliantStatus'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_SECTION_TITLE_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_SECTION_TITLE_CHANGE,
      value: 'SectionTitle'
    }
    const initState = {
    }
    const expectedState = {
      SectionTitle: 'SectionTitle'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_RULE_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_RULE_CHANGE,
      value: 'Rule'
    }
    const initState = {
    }
    const expectedState = {
      Rule: 'Rule'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_SUBSECTION_TITLE_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_SUBSECTION_TITLE_CHANGE,
      value: 'SubsectionTitle'
    }
    const initState = {
    }
    const expectedState = {
      SubsectionTitle: 'SubsectionTitle'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_SUBSECTION_TEXT_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_SUBSECTION_TEXT_CHANGE,
      value: 'SubsectionText'
    }
    const initState = {
    }
    const expectedState = {
      SubsectionText: 'SubsectionText'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_IMPLEMENTATION_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_IMPLEMENTATION_CHANGE,
      value: 'Implementation'
    }
    const initState = {
    }
    const expectedState = {
      Implementation: 'Implementation'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE,
      value: 'ImplementationSpecificText'
    }
    const initState = {
    }
    const expectedState = {
      ImplementationSpecificText: 'ImplementationSpecificText'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_CURRENT_STATE_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_CURRENT_STATE_CHANGE,
      value: 'CurrentState'
    }
    const initState = {
    }
    const expectedState = {
      CurrentState: 'CurrentState'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_REFERENCE_NOTES_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_REFERENCE_NOTES_CHANGE,
      value: 'ReferenceNotes'
    }
    const initState = {
    }
    const expectedState = {
      ReferenceNotes: 'ReferenceNotes'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_REMEDIATION_STATUS_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_REMEDIATION_STATUS_CHANGE,
      value: 'RemediationStatusId'
    }
    const initState = {
    }
    const expectedState = {
      RemediationStatusId: 'RemediationStatusId'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_RESOURCE_ASSIGN_SAVE for resource', () => {
    const action = {
      type: types.COMPLIANCE_RESOURCE_ASSIGN_SAVE,
      resource: "1",
      group: undefined
    }
    const initState = {
      ResourceId: "",
      GroupId: ""
    }
    const expectedState = {
      ResourceId: "1",
      GroupId: undefined
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_RESOURCE_ASSIGN_SAVE for group', () => {
    const action = {
      type: types.COMPLIANCE_RESOURCE_ASSIGN_SAVE,
      resource: undefined,
      group: "1"
    }
    const initState = {
      ResourceId: "",
      GroupId: ""
    }
    const expectedState = {
      ResourceId: undefined,
      GroupId: "1"
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_MITIGATION_DATE_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_MITIGATION_DATE_CHANGE,
      value: 'MitigationDate'
    }
    const initState = {
    }
    const expectedState = {
      RemediationDate: 'MitigationDate'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_MITIGATION_DATE_SELECTED', () => {
    const action = {
      type: types.COMPLIANCE_MITIGATION_DATE_SELECTED,
      value: 'MitigationDate'
    }
    const initState = {
    }
    const expectedState = {
      RemediationDate: 'MitigationDate'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })

  it('should handle COMPLIANCE_REMEDIATION_NOTES_CHANGE', () => {
    const action = {
      type: types.COMPLIANCE_REMEDIATION_NOTES_CHANGE,
      value: 'RemediationNotes'
    }
    const initState = {
    }
    const expectedState = {
      RemediationNotes: 'RemediationNotes'
    }
    expect(reducer(initState, action)).toEqual(expectedState)
  })
})