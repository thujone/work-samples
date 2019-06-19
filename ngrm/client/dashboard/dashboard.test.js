import React from 'react'
import { shallow } from 'enzyme'
import Dashboard from './dashboard'
import BrandingContainer from '../containers/branding-selector/branding-container'
import AlertSummary from '../components/alert-summary'
import {
  GaugeChart,
  FilterableColumnChart
} from '../components/charts'


describe('Dashboard', () => {
  let props

  beforeEach(() => {
    props = {
      engagementId: 'engagementId',
      charts: {
        riskGaugeChart: {}
      },
      actions: {
        getDashboardCharts: jest.fn()
      }
    }
  })

  it('should get dashboard charts on did mount', () => {
    const page = shallow(<Dashboard {...props} />)
    page.instance().componentDidMount()
    expect(props.actions.getDashboardCharts).toHaveBeenCalledWith('engagementId')
  })

  it('should get dashboard charts on did update', () => {
    const page = shallow(<Dashboard {...props} />)
    page.instance().componentDidUpdate()
    expect(props.actions.getDashboardCharts).toHaveBeenCalledWith('engagementId')
  })

  it('should render BrandingContainer', () => {
    const page = shallow(<Dashboard {...props} />)
    expect(page.find(BrandingContainer)).toHaveLength(1)
  })

  it('should render Overall Risk Score Chart', () => {
    const page = shallow(<Dashboard {...props} />)
    expect(page.find(GaugeChart)).toHaveLength(1)
  })

  it('should render Alert Summary', () => {
    const page = shallow(<Dashboard {...props} />)
    expect(page.find(AlertSummary)).toHaveLength(1)
  })

  it('should render Remediation Summary Chart', () => {
    const page = shallow(<Dashboard {...props} />)
    expect(page.find(FilterableColumnChart)).toHaveLength(1)
  })

})
