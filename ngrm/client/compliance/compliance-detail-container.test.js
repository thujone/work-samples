import React from 'react'
import ComplianceDetailContainer from './compliance-detail-container'
import { createStore } from 'redux'
import { shallow } from 'enzyme'
import * as actions from './compliance-actions'

describe("Compliance  Detail Container", () => {
  let state
  beforeEach(() => {
    state = {
      session: {
        entitlements: {
          list: {
            complianceRoles: 'entitlements'
          }
        }
      },
      branding: {
        selectedEngagement: 'engagementId',
      },
      complianceDetail: 'complianceDetail',
      ui: {
        complianceDetail: 'ui.complianceDetail'
      }
    }
  })

  it('should map state to props', () => {

    let subject = shallow(<ComplianceDetailContainer
      store={createStore(s => s, state)} />
    )

    expect(subject.props().engagementId).toEqual('engagementId')
    expect(subject.props().compliance).toEqual('complianceDetail')
    expect(subject.props().ui).toEqual('ui.complianceDetail')
    expect(subject.props().entitlements).toEqual('entitlements')
  })

  it('should map state to props with undefined entitlements', () => {

    state.session.entitlements.list = {}
    let subject = shallow(<ComplianceDetailContainer
      store={createStore(s => s, state)} />
    )

    expect(subject.props().entitlements).toEqual({})
  })

  it('should map dispatch to props', () => {


    let subject = shallow(<ComplianceDetailContainer
      store={createStore(s => s, state)} />
    )

    expect(subject.props().actions.update).toBeDefined()
    expect(subject.props().actions.handleCmmiStatusChange).toBeDefined()
    expect(subject.props().actions.handleCompliantStatusChange).toBeDefined()
    expect(subject.props().actions.handleSectionTitleChange).toBeDefined()
    expect(subject.props().actions.handleRuleChange).toBeDefined()
    expect(subject.props().actions.handleSubsectionTitleChange).toBeDefined()
    expect(subject.props().actions.handleSubsectionTextChange).toBeDefined()
    expect(subject.props().actions.handleImplementationChange).toBeDefined()
    expect(subject.props().actions.handleImplementationSpecificTextChange).toBeDefined()
    expect(subject.props().actions.handleCurrentStateChange).toBeDefined()
    expect(subject.props().actions.handleReferenceNotesChange).toBeDefined()
    expect(subject.props().actions.handleRemediationNotesChange).toBeDefined()
    expect(subject.props().actions.handleRemediationStatusChange).toBeDefined()
    expect(subject.props().actions.handleMitigationDateChange).toBeDefined()
    expect(subject.props().actions.handleMitigationDateSelected).toBeDefined()
    expect(subject.props().actions.handleMitigationDateClick).toBeDefined()
    expect(subject.props().actions.handleMitigationDateClose).toBeDefined()
    expect(subject.props().actions.handleResourceAssignSave).toBeDefined()
    expect(subject.props().willMount).toBeDefined()
  })

  it('should pass props to actions.get', () => {

    const store = createStore(s => s, state)
    let subject = shallow(<ComplianceDetailContainer
      store={store} />
    )

    const returnMock = jest.fn()
    actions.get = jest.fn().mockReturnValue(returnMock)
    subject.props().willMount(
      {
        engagementId: 'mockEngagementId',
        location: 'location',
        match: {
          params: {
            complianceId: 'mockComplianceId',
            schemeId: 'mockSchemeId'
          }
        }
      }
    )
    expect(actions.get).toHaveBeenCalledWith(store.dispatch)
    expect(returnMock).toHaveBeenCalledWith('mockEngagementId', 'mockSchemeId', 'mockComplianceId', 'location')
  })
})
