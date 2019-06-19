import * as types from './compliance-action-types'

export const initState = {
  Id: '',
  EngagementId: '',
  CmmiStatusId: '',
  RemediationStatusId: '',
  ResourceId: '',
  GroupId: '',
  ResourceList: [],
  GroupList: [],
  CompliantStatusId: '',
  ImportId: '',
  SectionTitle: '',
  Rule: '',
  SubsectionTitle: '',
  SubsectionText: '',
  Implementation: '',
  ImplementationSpecificText: '',
  CmmiStatus: '',
  RemediationStatus: '',
  Compliant: '',
  CurrentState: '',
  ReferenceNotes: '',
  UpdatedDate: '',
  UpdatedBy: '',
  ImportedDate: '',
  ImportedBy: '',
  RemediationDate: '',
  RemediationNotes: '',
  CmmiStatusList: [],
  RemediationStatusList: [],
  CompliantStatusList: []
}

const complianceDetailReducer = (state = initState, action) => {
  switch (action.type) {
    case types.COMPLIANCE_GET_SUCCESS:
      return {
        ...state,
        ...action.payload
      }
    case types.COMPLIANCE_POST_FETCHING:
      return {
        ...state,
        IsFetching: true
      }
    case types.COMPLIANCE_POST_SUCCESS:
      return {
        ...state,
        IsFetching: false
      }
    case types.COMPLIANCE_POST_FAILED:
      return {
        ...state,
        IsFetching: false
      }
    case types.COMPLIANCE_CMMI_STATUS_CHANGE:
      return {
        ...state,
        CmmiStatusId: action.value
      }
    case types.COMPLIANCE_COMPLIANT_STATUS_CHANGE:
      return {
        ...state,
        CompliantStatusId: action.value
      }
    case types.COMPLIANCE_SECTION_TITLE_CHANGE:
      return {
        ...state,
        SectionTitle: action.value
      }
    case types.COMPLIANCE_RULE_CHANGE:
      return {
        ...state,
        Rule: action.value
      }
    case types.COMPLIANCE_SUBSECTION_TITLE_CHANGE:
      return {
        ...state,
        SubsectionTitle: action.value
      }
    case types.COMPLIANCE_SUBSECTION_TEXT_CHANGE:
      return {
        ...state,
        SubsectionText: action.value
      }
    case types.COMPLIANCE_IMPLEMENTATION_CHANGE:
      return {
        ...state,
        Implementation: action.value
      }
    case types.COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE:
      return {
        ...state,
        ImplementationSpecificText: action.value
      }
    case types.COMPLIANCE_CURRENT_STATE_CHANGE:
      return {
        ...state,
        CurrentState: action.value
      }
    case types.COMPLIANCE_REFERENCE_NOTES_CHANGE:
      return {
        ...state,
        ReferenceNotes: action.value
      }
    case types.COMPLIANCE_REMEDIATION_STATUS_CHANGE:
      return {
        ...state,
        RemediationStatusId: action.value
      }
    case types.COMPLIANCE_MITIGATION_DATE_CHANGE:
    case types.COMPLIANCE_MITIGATION_DATE_SELECTED:
      return {
        ...state,
        RemediationDate: action.value
      }
    case types.COMPLIANCE_RESOURCE_ASSIGN_SAVE:
      return {
        ...state,
        EngagementId: action.engagementId,
        ResourceId: action.resource,
        GroupId: action.group
      }
    case types.COMPLIANCE_REMEDIATION_NOTES_CHANGE:
      return {
        ...state,
        RemediationNotes: action.value
      }
    default:
      return state
  }
}

export default complianceDetailReducer
