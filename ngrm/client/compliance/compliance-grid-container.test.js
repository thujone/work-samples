import React from 'react'
import { createStore } from 'redux'
import { shallow, mount } from 'enzyme'
import ComplianceGridContainer from './compliance-grid-container'
import * as actions from './compliance-actions'

describe("Compliance Grid Container", () => {
  let state
  let ownProps

  beforeEach(() => {
    actions.handleDeleteComplianceScheme = jest.fn().mockReturnValueOnce('handleDeleteComplianceScheme')
    actions.handleUpload = jest.fn().mockReturnValueOnce('handleUpload')

    state = {
      branding: {
        selectedEngagement: 'engagementId'
      },
      schemeId: 'schemeId',
      session: {
        entitlements: {
          list: {
            complianceRoles: 'complianceRoles'
          }
        }
      },
      charts: {
        compliance: 'complianceCharts'
      }
    }

    ownProps = {
      match: {
        params: {
          schemeId: 'schemeId'
        }
      }
    }
  })

  it('should map state to props', () => {
    const subject = shallow(<ComplianceGridContainer match={ownProps.match} store={createStore(s => s, state)} />)
    expect(subject.props().engagementId).toEqual('engagementId')
    expect(subject.props().entitlements).toEqual('complianceRoles')
    expect(subject.props().charts).toEqual({byGapReviewChart: null, byMaturityLevelChart: null})
  })

  it('should map dispatch to props', () => {
    const subject = shallow(<ComplianceGridContainer match={ownProps.match} store={createStore(s => s, state)} />)
    expect(subject.props().actions.handleUpload).toEqual('handleUpload')
  })

})
