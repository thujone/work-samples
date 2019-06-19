import React from 'react'
import { shallow, mount } from 'enzyme'
import ColumnChart from './column-chart'
import ReactHighcharts from 'react-highcharts'
import * as factory from './chart-factory'

describe("Column Chart", () => {
  let props
  let mockConfig = {
    setting: 'value'
  }

  beforeEach(() => {
    factory.createColumnChartConfig = jest.fn().mockReturnValue(mockConfig)

    props = {
      id: 'id',
      title: 'title',
      subtitle: 'subtitle',
      xTitle: 'xTitle',
      yTitle: 'yTitle',
      height: 'height',
      className: 'col-md-6',
      chart: {
        Series: 'seriesData'
      },
      onClick: jest.fn()
    }
  })

  it("should render with props", () => {
    const subject = shallow(<ColumnChart {...props} />)

    const wrapper = subject.find('div')
    expect(wrapper.props().id).toEqual('id')
    expect(wrapper.props().className).toEqual('col-md-6')

    const columnChart = wrapper.find(ReactHighcharts)
    expect(columnChart.props().isPureConfig).toBeDefined()
    expect(factory.createColumnChartConfig).toHaveBeenCalledWith(props.title, props.subtitle, props.xTitle, props.yTitle, props.height)
    expect(columnChart.props().config.setting).toEqual('value')
  })

})
