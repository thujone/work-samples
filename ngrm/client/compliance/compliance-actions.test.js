import configureMockStore from 'redux-mock-store'
import moxios from 'moxios'
import * as endpoints from '../constants/endpoints'
import * as routes from '../constants/routes'
import * as httpStatus from '../constants/http-status-codes'
import * as actions from './compliance-actions'
import * as types from './compliance-action-types'
import * as chartTypes from '../components/charts/chart-action-types'
import * as chartActions from '../components/charts/chart-actions'

const mockStore = configureMockStore()

describe('Compliance Actions', () => {

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  it('should dispatch COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING when invoking getComplianceSchemes', () => {
    const dispatch = jest.fn()
    const history = {
      push: jest.fn()
    }

    actions.getComplianceSchemes(dispatch)('engagementId', history)
    expect(dispatch).toHaveBeenCalledWith({type: types.COMPLIANCE_SCHEMES_GET_ITEMS_FETCHING})
  })

  it('should redirect to current scheme when invoking getComplianceSchemes', async () => {
    const dispatch = jest.fn()
    const history = {
      push: jest.fn()
    }

    moxios.stubRequest(`${endpoints.COMPLIANCE_SCHEMES}/engagementId`, {
      status: httpStatus.OK,
      response: [{Id: 1}, {Id: 2}]
    })

    await actions.getComplianceSchemes(dispatch)('engagementId', 'schemeId', history)
    expect(history.push).toHaveBeenCalledWith(`${routes.COMPLIANCE_PAGE}/engagementId/schemeId`)
  })

  it('should redirect to first scheme when invoking getComplianceSchemes', async () => {
    const dispatch = jest.fn()
    const history = {
      push: jest.fn()
    }

    moxios.stubRequest(`${endpoints.COMPLIANCE_SCHEMES}/engagementId`, {
      status: httpStatus.OK,
      response: [{Id: 1}, {Id: 2}]
    })

    await actions.getComplianceSchemes(dispatch)('engagementId', undefined, history)
    expect(history.push).toHaveBeenCalledWith(`${routes.COMPLIANCE_PAGE}/engagementId/1`)
  })

  it('should redirect to add scheme when invoking getComplianceSchemes', async () => {
    const dispatch = jest.fn()
    const history = {
      push: jest.fn()
    }

    moxios.stubRequest(`${endpoints.COMPLIANCE_SCHEMES}/engagementId`, {
      status: httpStatus.OK,
      response: []
    })

    await actions.getComplianceSchemes(dispatch)('engagementId', undefined, history)
    expect(history.push).toHaveBeenCalledWith(`${routes.COMPLIANCE_PAGE}/engagementId/add`)
  })

  it('should dispatch COMPLIANCE_SCHEMES_ADD_FETCHING when invoking addComplianceScheme()', () => {
    const dispatch = jest.fn()
    const history = {
      push: jest.fn()
    }

    actions.addComplianceScheme(dispatch)('engagementId', 'name', history)
    expect(dispatch).toHaveBeenCalledWith({type: types.COMPLIANCE_SCHEMES_ADD_FETCHING})
  })

  it('should get the grid and get the compliance charts', async () => {
    const dispatch = jest.fn()
    const mockTable = { fetchRows: jest.fn() }
    chartActions.getComplianceCharts = jest.fn().mockReturnValue(jest.fn())

    actions.getGrid(dispatch)('engagementId', 'schemeId', mockTable)
    expect(chartActions.getComplianceCharts()).toHaveBeenCalledWith('engagementId', 'schemeId')
    expect(mockTable.fetchRows).toHaveBeenCalled()
  })

  it('should dispatch COMPLIANCE_GET_FETCHING when invoking get()', () => {
    const dispatch = jest.fn()

    actions.get(dispatch)('engagementId', 'schemeId', 'complianceId')
    expect(dispatch).toHaveBeenCalledWith({type: types.COMPLIANCE_GET_FETCHING})
  })

  describe('handleUpload', () => {
    it('should handleUpload success and getGrid', async () => {
      const store = mockStore()
      const mockTable = { fetchRows: jest.fn() }
      const mockOnSuccess = jest.fn()
      const mockOnFailure = jest.fn()
      const response = "test"

      moxios.stubRequest(endpoints.IMPORT_COMPLIANCE, {
        status: httpStatus.OK,
        response
      })

      await actions.handleUpload(store.dispatch)(mockTable)('file', 'engagementId', mockOnSuccess, mockOnFailure, 'schemeId')
      const importRequest = moxios.requests.at(0)
      expect(importRequest.config.method).toEqual("post")
      expect(importRequest.config.data.get("EngagementId")).toEqual("engagementId")
      expect(importRequest.config.data.get("SchemeId")).toEqual("schemeId")
      expect(importRequest.config.data.get("File")).toEqual("file")

      expect(mockOnSuccess).toHaveBeenCalledWith(response)
      expect(mockTable.fetchRows).toHaveBeenCalled()
      expect(chartActions.getComplianceCharts()).toHaveBeenCalledWith('engagementId', 'schemeId')
    })

    it('should handleUpload failure with error message', async () => {
      const store = mockStore()
      const mockTable = { fetchRows: jest.fn() }
      const mockOnSuccess = jest.fn()
      const mockOnFailure = jest.fn()
      const response = "error message"

      moxios.stubRequest(endpoints.IMPORT_COMPLIANCE, {
        status: httpStatus.BAD_REQUEST,
        response
      })

      await actions.handleUpload(store.dispatch)(mockTable)('file', 'engagementId', mockOnSuccess, mockOnFailure, 'schemeId')
        .catch(() => {
          expect(mockOnFailure).toHaveBeenCalledWith(response, {})
        })
    })

    it('should handleUpload failure with field error', async () => {
      const store = mockStore()
      const mockTable = { fetchRows: jest.fn() }
      const mockOnSuccess = jest.fn()
      const mockOnFailure = jest.fn()
      const response = { field: "message" }

      moxios.stubRequest(endpoints.IMPORT_COMPLIANCE, {
        status: httpStatus.BAD_REQUEST,
        response
      })

      await actions.handleUpload(store.dispatch)(mockTable)('file', 'engagementId', mockOnSuccess, mockOnFailure, 'schemeId')
        .catch(() => {
          expect(mockOnFailure).toHaveBeenCalledWith('', response)
        })
    })
  })

  describe('update', () => {
    it('should dispatch COMPLIANCE_POST_FETCHING', () => {
      const store = mockStore()
      const expectedActions = { type: types.COMPLIANCE_POST_FETCHING }

      actions.update(store.dispatch)('details', 'history', 'engagementId', 'complianceSchemeId')

      expect(store.getActions()[0]).toEqual(expectedActions)
    })

    it('should dispatch COMPLIANCE_POST_SUCCESS', async () => {
      const store = mockStore()
      const response = "test"
      let schemeId, engagementId;
      const expectedActions = { type: types.COMPLIANCE_POST_SUCCESS, payload: "test" }
      var data = {
        Id: 'Id',
        SchemeId: null,
        EngagementId: null,
        CmmiStatusId: 'CmmiStatusId',
        RemediationStatusId: 'RemediationStatusId',
        ResourceId: 'ResourceId',
        GroupId: 'GroupId',
        ResourceList: 'ResourceList',
        GroupList: 'GroupList',
        SectionTitle: 'SectionTitle',
        Rule: 'Rule',
        SubsectionTitle: 'SubsectionTitle',
        SubsectionText: 'SubsectionText',
        Implementation: 'Implementation',
        ImplementationSpecificText: 'ImplementationSpecificText',
        CompliantStatusId: 'CompliantStatusId',
        CurrentState: 'CurrentState',
        ReferenceNotes: 'ReferenceNotes',
        RemediationDate: 'RemediationDate',
        RemediationNotes: 'RemediationNotes'
      };

      const history = []
      moxios.stubRequest(endpoints.COMPLIANCE, {
        status: httpStatus.OK,
        response
      })
      await actions.update(store.dispatch)(data, history)

      expect(store.getActions()[1]).toEqual(expectedActions)

      let request = moxios.requests.mostRecent()
      expect(request.config.method).toEqual('post')
      expect(request.config.data).toEqual(JSON.stringify(data))
      expect(history[0]).toEqual(routes.COMPLIANCE_PAGE + '/' + engagementId + '/' + schemeId)
    })

    it('should dispatch COMPLIANCE_POST_FAILED', async () => {
      const store = mockStore()
      const response = "error"
      const expectedActions = { type: types.COMPLIANCE_POST_FAILED, validationErrors: "error" }

      moxios.stubRequest(endpoints.COMPLIANCE, {
        status: httpStatus.BAD_REQUEST,
        response
      })

      await actions.update(store.dispatch)('details', 'history', 'engagementId', 'complianceSchemeId')

      expect(store.getActions()[1]).toEqual(expectedActions)
    })

  })

  describe('handleResourceAssignSave', () => {
    it('should dispatch a COMPLIANCE_RESOURCE_ASSIGN_SAVE action', () => {
      const dispatch = jest.fn()
      actions.handleResourceAssignSave(dispatch)('resource', 'group', 'engagementId')
      expect(dispatch).toHaveBeenCalledWith({type: 'COMPLIANCE_RESOURCE_ASSIGN_SAVE', resource: 'resource', group: 'group', engagementId: 'engagementId'})
    })
  })

  describe('handleMitigationDateSelected', () => {
    it('should dispatch a COMPLIANCE_MITIGATION_DATE_SELECTED action', () => {
      const dispatch = jest.fn()
      actions.handleMitigationDateSelected(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type: 'COMPLIANCE_MITIGATION_DATE_SELECTED', value: 'value'})
    })
  })

  describe('handleMitigationDateChange', () => {
    it('should dispatch a COMPLIANCE_MITIGATION_DATE_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleMitigationDateChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type: 'COMPLIANCE_MITIGATION_DATE_CHANGE', value: 'value'})
    })
  })

  describe('handleRemediationStatusChange', () => {
    it('should dispatch a COMPLIANCE_REMEDIATION_STATUS_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleRemediationStatusChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_REMEDIATION_STATUS_CHANGE', value: 'value'})
    })
  })

  describe('handleMitigationDateClick', () => {
    it('should dispatch a COMPLIANCE_MITIGATION_DATE_CLICK action', () => {
      const dispatch = jest.fn()
      actions.handleMitigationDateClick(dispatch)()
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_MITIGATION_DATE_CLICK'})
    })
  })

  describe('handleMitigationDateClose', () => {
    it('should dispatch a COMPLIANCE_MITIGATION_DATE_CLOSE action', () => {
      const dispatch = jest.fn()
      actions.handleMitigationDateClose(dispatch)()
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_MITIGATION_DATE_CLOSE'})
    })
  })

  describe('handleCmmiStatusChange', () => {
    it('should dispatch a COMPLIANCE_CMMI_STATUS_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleCmmiStatusChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_CMMI_STATUS_CHANGE', value: 'value'})
    })
  })

  describe('handleCompliantStatusChange', () => {
    it('should dispatch a COMPLIANCE_COMPLIANT_STATUS_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleCompliantStatusChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_COMPLIANT_STATUS_CHANGE', value: 'value'})
    })
  })

  describe('handleSectionTitleChange', () => {
    it('should dispatch a COMPLIANCE_SECTION_TITLE_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleSectionTitleChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_SECTION_TITLE_CHANGE', value: 'value'})
    })
  })

  describe('handleRuleChange', () => {
    it('should dispatch a COMPLIANCE_RULE_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleRuleChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_RULE_CHANGE', value: 'value'})
    })
  })

  describe('handleSubsectionTitleChange', () => {
    it('should dispatch a COMPLIANCE_SUBSECTION_TITLE_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleSubsectionTitleChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_SUBSECTION_TITLE_CHANGE', value: 'value'})
    })
  })

  describe('handleSubsectionTextChange', () => {
    it('should dispatch a COMPLIANCE_SUBSECTION_TEXT_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleSubsectionTextChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_SUBSECTION_TEXT_CHANGE', value: 'value'})
    })
  })

  describe('handleImplementationChange', () => {
    it('should dispatch a COMPLIANCE_IMPLEMENTATION_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleImplementationChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_IMPLEMENTATION_CHANGE', value: 'value'})
    })
  })

  describe('handleImplementationSpecificTextChange', () => {
    it('should dispatch a COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleImplementationSpecificTextChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_IMPLEMENTATION_SPECIFIC_TEXT_CHANGE', value: 'value'})
    })
  })

  describe('handleCurrentStateChange', () => {
    it('should dispatch a COMPLIANCE_CURRENT_STATE_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleCurrentStateChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_CURRENT_STATE_CHANGE', value: 'value'})
    })
  })

  describe('handleReferenceNotesChange', () => {
    it('should dispatch a COMPLIANCE_REFERENCE_NOTES_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleReferenceNotesChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_REFERENCE_NOTES_CHANGE', value: 'value'})
    })
  })

  describe('handleRemediationNotesChange', () => {
    it('should dispatch a COMPLIANCE_REMEDIATION_NOTES_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleRemediationNotesChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_REMEDIATION_NOTES_CHANGE', value: 'value'})
    })
  })

  describe('handleNameChange', () => {
    it('should dispatch a COMPLIANCE_SCHEME_NAME_CHANGE action', () => {
      const dispatch = jest.fn()
      actions.handleNameChange(dispatch)('value')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_SCHEME_NAME_CHANGE', value: 'value'})
    })
  })

  describe('handleDeleteComplianceScheme', () => {
    it('should dispatch a COMPLIANCE_DELETE_SCHEME_FETCHING action', () => {
      const dispatch = jest.fn()
      actions.handleDeleteComplianceScheme(dispatch)('schemeId', 'engagementId', 'history')
      expect(dispatch).toHaveBeenCalledWith({type:'COMPLIANCE_DELETE_SCHEME_FETCHING'})
    })
  })

})
