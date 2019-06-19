import React from 'react'
import ComplianceAddFormContainer from './compliance-add-form-container'
import { createStore } from 'redux'
import { shallow } from 'enzyme'
import * as actions from './compliance-actions'


describe("Compliance  Add Form Container", () => {

  let state, props

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
      ui: {
        complianceAddForm: 'ui.complianceAddForm'
      }
    }

    props = {
      match: {
        params: {
          engagementId: 'matchEngagementId',
          schemeId: 'matchSchemeId'
        }
      }
    }
  })

  it('should map state to props', () => {
    let subject = shallow(<ComplianceAddFormContainer {...props}
      store={createStore(s => s, state)} />
    )

    expect(subject.props().engagementId).toEqual('engagementId')
    expect(subject.props().ui).toEqual('ui.complianceAddForm')
    expect(subject.props().entitlements).toEqual('entitlements')
  })

  it('should map state to props with undefined entitlements', () => {
    state.session.entitlements.list = {}
    let subject = shallow(<ComplianceAddFormContainer {...props}
      store={createStore(s => s, state)} />
    )

    expect(subject.props().entitlements).toEqual({})
  })

  it('should map dispatch to props', () => {
    let subject = shallow(<ComplianceAddFormContainer {...props}
      store={createStore(s => s, state)} />
    )

    expect(subject.props().actions.addComplianceScheme).toBeDefined()
  })

  it('should merge props', () => {
    state.branding.selectedEngagement = undefined
    let subject = shallow(<ComplianceAddFormContainer {...props}
      store={createStore(s => s, state)} />
    )

    expect(subject.props().engagementId).toEqual('matchEngagementId')
    expect(subject.props().schemeId).toEqual('matchSchemeId')
  })

})
