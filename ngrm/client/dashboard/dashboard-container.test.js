import React from 'react'
import { createStore } from 'redux'
import { shallow } from 'enzyme'
import DashboardContainer from './dashboard-container'
import * as chartActions from '../components/charts/chart-actions'

describe("Dashboard Container", () => {
  let state
  beforeEach(() => {
    state = {
      branding: {
        selectedEngagement: 'selectedEngagement'
      },
      ui: {
        dashboard: 'ui.dashboard'
      },
      dashboard: 'dashboard',
      charts: {
        dashboard: { chart: 'chart' }
      }
    }
  })

  it('should map state to props', () => {
    const subject = shallow(<DashboardContainer
      store={createStore(s => s, state)} />
    )

    expect(subject.props().engagementId).toEqual('selectedEngagement')
    expect(subject.props().dashboard).toEqual('dashboard')
    expect(subject.props().ui).toEqual('ui.dashboard')
    expect(subject.props().charts.chart).toEqual('chart')
  })

  it('should map dispatch to props', () => {
    const subject = shallow(<DashboardContainer
      store={createStore(s => s, state)} />
    )

    expect(subject.props().actions.getDashboardCharts).toBeDefined()
  })

  it('should map engagementId from state', () => {
    state.branding.selectedEngagement = 'a'
    const subject = shallow(<DashboardContainer
      match={{ params: { engagementId: 'b' } }}
      store={createStore(s => s, state)} />
    )
    expect(subject.props().engagementId).toEqual('a')
  })

  it('should map engagementId from route match params', () => {
    state.branding.selectedEngagement = ''
    const subject = shallow(<DashboardContainer
      match={{ params: { engagementId: 'b' } }}
      store={createStore(s => s, state)} />
    )
    expect(subject.props().engagementId).toEqual('b')
  })

})
