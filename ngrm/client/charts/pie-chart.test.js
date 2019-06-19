import React from 'react'
import { shallow, mount } from 'enzyme'
import PieChart from './pie-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Pie Chart", () => {
  let props
  let mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createPieChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
      height: 'height',
      className: 'col-md-6',
      chart: { Series: 'seriesData' },
      onClick: jest.fn()
    }
  })

  it("should render with props", () => {
    const subject = shallow(<PieChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const pieChart = wrapper.find(ReactHighcharts)
    expect(pieChart.props().isPureConfig).toBeDefined()
    expect(factory.createPieChartConfig).toHaveBeenCalledWith(props.title, props.subtitle, props.height)
    expect(pieChart.props().config.setting).toEqual('value')
  })
})
