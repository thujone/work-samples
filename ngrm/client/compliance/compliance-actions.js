import axios from 'axios'
import * as endpoints from '../constants/endpoints'
import * as routes from '../constants/routes'
import * as httpStatus from '../constants/http-status-codes'
import * as types from './compliance-action-types'
import * as chartActions from '../components/charts/chart-actions'


export const getComplianceSchemes = dispatch => (engagementId, schemeId, history) => {
  dispatch({ type: types.COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING })

  return axios.get(`${endpoints.COMPLIANCE_SCHEMES}/${engagementId}`)
    .then(r => {
      dispatch({ type: types.COMPLIANCE_SCHEMES_GET_ITEMS_SUCCESS, payload: r.data })

      if (schemeId) {
        history.push(`${routes.COMPLIANCE_PAGE}/${engagementId}/${schemeId}`)
        return
      }

      if (r.data.length > 0) {
        history.push(`${routes.COMPLIANCE_PAGE}/${engagementId}/${r.data[0].Id}`)
        return
      }

      history.push(`${routes.COMPLIANCE_PAGE}/${engagementId}/add`)
    })
    .catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return
      dispatch({ type: types.COMPLIANCE_SCHEMES_GET_ITEMS_FAILED, error: e.response.data })
    })
}

export const addComplianceScheme = dispatch => (engagementId, name, history) => {
  dispatch({ type: types.COMPLIANCE_SCHEMES_ADD_FETCHING })

  var data = {
    Id: 0,
    EngagementId: engagementId,
    Name: name
  };

  return axios.post(`${endpoints.COMPLIANCE_SCHEMES}`, data)
    .then(r => {
      dispatch({ type: types.COMPLIANCE_SCHEMES_ADD_SUCCESS, payload: r.data })
      history.push(`${routes.COMPLIANCE_PAGE}/${engagementId}/${r.data.Id}`)
    })
    .catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return
      dispatch({ type: types.COMPLIANCE_SCHEMES_ADD_FAILED, error: e.response.data })
    })
}

export const getGrid = dispatch => (engagementId, schemeId, table) => {
  if (!engagementId || !schemeId) return

  chartActions.getComplianceCharts(dispatch)(engagementId, schemeId)
  table.fetchRows()
}

export const get = dispatch => (engagementId, schemeId, complianceId) => {
  dispatch({ type: types.COMPLIANCE_GET_FETCHING })
  return axios.get(endpoints.COMPLIANCE + '/' + engagementId + '/' + schemeId + '/' + complianceId)
    .then(r => dispatch({ type: types.COMPLIANCE_GET_SUCCESS, payload: r.data }))
    .catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return
      dispatch({ type: types.COMPLIANCE_GET_FAILED, error: e.response.data })
    })
}

export const update = dispatch => (details, history, engagementId, complianceSchemeId) => {
  var data = {
    Id: details.Id,
    SchemeId: parseInt(complianceSchemeId, 10),
    EngagementId: parseInt(engagementId, 10),
    CmmiStatusId: details.CmmiStatusId,
    RemediationStatusId: details.RemediationStatusId,
    ResourceId: details.ResourceId,
    GroupId: details.GroupId,
    ResourceList: details.ResourceList,
    GroupList: details.GroupList,
    SectionTitle: details.SectionTitle,
    Rule: details.Rule,
    SubsectionTitle: details.SubsectionTitle,
    SubsectionText: details.SubsectionText,
    Implementation: details.Implementation,
    ImplementationSpecificText: details.ImplementationSpecificText,
    CompliantStatusId: details.CompliantStatusId,
    CurrentState: details.CurrentState,
    ReferenceNotes: details.ReferenceNotes,
    RemediationDate: details.RemediationDate,
    RemediationNotes: details.RemediationNotes
  };

  dispatch({ type: types.COMPLIANCE_POST_FETCHING })

  return axios.post(endpoints.COMPLIANCE, data)
    .then(r => {
      dispatch({ type: types.COMPLIANCE_POST_SUCCESS, payload: r.data })
      history.push(`${routes.COMPLIANCE_PAGE}/${engagementId}/${complianceSchemeId}`)
    })
    .catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return
      dispatch({ type: types.COMPLIANCE_POST_FAILED, validationErrors: e.response.data })
    })
}

export const handleUpload = dispatch => table => (file, engagementId, onSuccess, onFailure, schemeId) => {
  let data = new FormData()
  data.append("File", file)
  data.append("EngagementId", engagementId)
  data.append("SchemeId", schemeId);

  return axios.post(endpoints.IMPORT_COMPLIANCE, data)
    .then(r => {
      onSuccess(r.data)
      getGrid(dispatch)(engagementId, schemeId, table)
    }).catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return

      let errorMessage = ""
      let fieldErrors = {}

      if (typeof (e.response.data) === "string") {
        errorMessage = e.response.data
      }

      if (typeof (e.response.data) === "object") {
        fieldErrors = e.response.data
      }

      onFailure(errorMessage, fieldErrors)
    })
}

export const handleResourceAssignSave = dispatch => (resource, group, engagementId) => {
  return dispatch({ type: types.COMPLIANCE_RESOURCE_ASSIGN_SAVE, resource, group, engagementId })
}

export const handleMitigationDateSelected = dispatch => (value) => {
  return dispatch({ type: types.COMPLIANCE_MITIGATION_DATE_SELECTED, value })
}

export const handleMitigationDateChange = dispatch => (value) => {
  return dispatch({ type: types.COMPLIANCE_MITIGATION_DATE_CHANGE, value })
}

export const handleRemediationStatusChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_REMEDIATION_STATUS_CHANGE, value })
}

export const handleMitigationDateClick = dispatch => () => {
  dispatch({ type: types.COMPLIANCE_MITIGATION_DATE_CLICK })
}

export const handleMitigationDateClose = dispatch => () => {
  dispatch({ type: types.COMPLIANCE_MITIGATION_DATE_CLOSE })
}

export const handleCmmiStatusChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_CMMI_STATUS_CHANGE, value })
}

export const handleCompliantStatusChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_COMPLIANT_STATUS_CHANGE, value })
}

export const handleSectionTitleChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_SECTION_TITLE_CHANGE, value })
}

export const handleRuleChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_RULE_CHANGE, value })
}

export const handleSubsectionTitleChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_SUBSECTION_TITLE_CHANGE, value })
}

export const handleSubsectionTextChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_SUBSECTION_TEXT_CHANGE, value })
}

export const handleImplementationChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_IMPLEMENTATION_CHANGE, value })
}

export const handleImplementationSpecificTextChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE, value })
}

export const handleCurrentStateChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_CURRENT_STATE_CHANGE, value })
}

export const handleReferenceNotesChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_REFERENCE_NOTES_CHANGE, value })
}

export const handleRemediationNotesChange = dispatch => (value) => {
  dispatch({ type: types.COMPLIANCE_REMEDIATION_NOTES_CHANGE, value })
}


export const handleDeleteComplianceScheme = dispatch => (schemeId, engagementId, history) => {
  dispatch({type: types.COMPLIANCE_DELETE_SCHEME_FETCHING})

  return axios.delete(endpoints.COMPLIANCE_SCHEME + '/' + schemeId)
    .then(r => {
      dispatch({ type: types.COMPLIANCE_DELETE_SCHEME_SUCCESS, payload: r.data })
      getComplianceSchemes(dispatch)(engagementId, undefined, history)
    })
    .catch(e => {
      if (e.response.status !== httpStatus.BAD_REQUEST) return
      dispatch({ type: types.COMPLIANCE_DELETE_SCHEME_FAILED, error: e.response.data })
    })
}

export const handleNameChange = dispatch => (value) => {
  debugger;
  dispatch({ type: types.COMPLIANCE_SCHEME_NAME_CHANGE, value })
}

