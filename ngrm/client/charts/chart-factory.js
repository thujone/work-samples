// Reference: https://api.highcharts.com/highcharts

export const xAxisLabelMaxLength = 35

export const defaultShadow = {
  color: '#CCCCCC',
  offsetX: 2,
  offsetY: 2,
  width: 5
}

export const defaultColors = [
  '#009ac7',
  '#54bceb',
  '#439539',
  '#b2bb1e',
  '#ffc425',
  '#f19522',
  '#f15d22'
]

export const addSeriesClickHandler = (series, clickHandler) => {
  if (!Array.isArray(series) || series.length === 0)
    return

  series.forEach(s => {
    s.cursor = 'pointer'

    if (!Array.isArray(s.data) || s.data.length === 0)
      return

    s.data.forEach(d => {
      d.events = {
        ...d.events,
        click: clickHandler
      }
    })
  })
}

export const createPieChartConfig = (title, subtitle, height) => {
  const baseConfig = createConfig(title, subtitle, height)
  return {
    ...baseConfig,
    chart: {
      ...baseConfig.chart,
      type: 'pie'
    },
    tooltip: {
      ...baseConfig.tooltip,
      pointFormat: '<div><b>{point.percentage:.1f}%</b> of total {series.name}</div>'
    },
    plotOptions: {
      ...baseConfig.plotOptions,
      pie: {
        showInLegend: true
      }
    }
  }
}

export const createBarChartConfig = (title, subtitle, xTitle, yTitle, height, xMax = null, yMax = null, yTickInterval = null) => {
  const baseConfig = createConfig(title, subtitle, height)
  return {
    ...baseConfig,
    chart: {
      ...baseConfig.chart,
      type: 'bar'
    },
    tooltip: {
      ...baseConfig.tooltip,
      pointFormat: '<div><b>{point.severityName}</b></div>'
    },
    xAxis: {
      type: 'category',
      title: {
        text: xTitle
      },
      max: xMax
    },
    yAxis: {
      title: {
        text: yTitle
      },
      max: yMax,
      tickInterval: yTickInterval
    }
  }
}

export const createColumnChartConfig = (title, subtitle, xTitle, yTitle, height) => {
  const baseConfig = createConfig(title, subtitle, height)
  return {
    ...baseConfig,
    chart: {
      ...baseConfig.chart,
      type: 'column'
    },
    tooltip: {
      ...baseConfig.tooltip,
      pointFormatter: function () {
        const point = this
        let percentage = 0
        let seriesTotal = 0

        for (let index = 0; index < point.series.yData.length; index++) {
          seriesTotal += point.series.yData[index]
        }

        if (seriesTotal === 0)
          seriesTotal = 1

        percentage = Math.round(point.y / seriesTotal * 1000) / 10
        return `<div><b>${percentage.toFixed(1)}%</b> of total ${point.series.name}</div>`
      }
    },
    xAxis: {
      type: 'category',
      title: {
        text: xTitle
      },
      labels: {
        useHTML: true,
        reserveSpace: true,
        //autoRotation: false,
        align: 'center',
        formatter: function () {
          const point = this
          //adding spaces so that word will break and wrap
          const value = point.value.replace('/', ' / ')

          if (point.value.length > xAxisLabelMaxLength)
            return `<span title="${point.value}">${value.slice(0, xAxisLabelMaxLength - 3)}...</span>`

          return value
        }
      }
    },
    yAxis: {
      title: {
        text: yTitle
      }
    }
  }
}

export const createFilterableColumnChartConfig = (title, subtitle, height) => {
  const baseConfig = createConfig(title, subtitle, height)
  return {
    ...baseConfig,
    chart: {
      ...baseConfig.chart,
      type: 'column'
    },
    legend: {
      verticalAlign: 'bottom',
      y: 0
    },
    title: {
      y: -100,
      text: 'title'
    },
    plotOptions: {
      series: {
        shadow: false,
        pointPadding: 0,
        groupPadding: .085,
        dataLabels: {
          enabled: true,
          formatter: function() {
            if (this.y !== 0) {
              return this.y;
            }
          }
        }
      }
    },
    tooltip: {
      ...baseConfig.tooltip,
      pointFormatter: function () {
        const point = this
        return `<div><b>${point.y}</b> ${point.series.name}</div>`
      }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      tickWidth: 0,
      gridLineWidth: 1,
      labels: {
        style: {
          fontSize: '12px'
        },
        useHTML: true,
        reserveSpace: true,
        align: 'center',
        formatter: function () {
          const point = this
          const value = point.value.replace('/', ' / ')

          if (point.value.length > xAxisLabelMaxLength)
            return `<span title="${point.value}">${value.slice(0, xAxisLabelMaxLength - 3)}...</span>`

          return value
        }
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      },
      className: 'y-labels',
      align: 'center',
      tickInterval: 10,
      tickPosition: 'inside',
      showFirstLabel: false,
      showLastLabel: false
    },
    noData: {
      position: {
        x: -140,
        y: -20
      }
    },
    exporting: {
      sourceWidth: 831,
      scale: 1
    }
  }
}

export const createDualAxisChartConfig = (title, subtitle, height) => {
  const baseConfig = createConfig(title, subtitle, height)
  return {
    ...baseConfig,
    chart: {
      ...baseConfig.chart,
      zoomType: 'xy'
    },
    legend: {
      verticalAlign: 'bottom',
      y: 0
    },
    title: {
      y: -100,
      text: 'title'
    },
    plotOptions: {
      series: {
        shadow: false,
        pointPadding: 0,
        groupPadding: .085,
        dataLabels: {
          enabled: true,
          formatter: function() {
            if (this.y !== 0) {
              return this.y;
            }
          }
        }
      }
    },
    xAxis: {
      type: 'category',
      tickInterval: 1,
      tickWidth: 0,
      gridLineWidth: 0,
      labels: {
        style: {
          fontSize: '12px'
        },
        useHTML: true,
        reserveSpace: true,
        align: 'center',
        formatter: function () {
          const point = this
          const value = point.value.replace('/', ' / ')

          if (point.value.length > xAxisLabelMaxLength)
            return `<span title="${point.value}">${value.slice(0, xAxisLabelMaxLength - 3)}...</span>`

          return value
        }
      }
    },
    yAxis:    
    [{ // Primary yAxis
      labels: {
        format: '{value}',
        style: {
          color: '#009ac7',
          fontSize: '12px'
        }
      },
      title: {
        text: 'Vulnerabilities',
        style: {
          color: '#009ac7'
        }
      }
    }, { // Secondary yAxis
      title: {
        text: 'Risks',
        style: {
          color: 'rgb(241,194,34)',
          fontSize: '12px'
        }
      },
      labels: {
        format: '{value}',
        style: {
          color: 'rgb(241,194,34)'
        }
      },
      className: 'y-labels',
      align: 'center',
      tickInterval: 1,
      tickPosition: 'inside',
      showFirstLabel: true,
      showLastLabel: true,
      opposite: true
    }],
    tooltip: {
      crosshairs: true,
      shared: true,
      style: {
        background: '#ffffff'
      },
      positioner: function(labelWidth, labelHeight, point) {
        var x;
        if (point.plotX - labelWidth / 2 > 0) {
          x = point.plotX - labelWidth / 2;
        } else {
          x = 0
        }
        return {
          x: x,
          y: point.plotY
        }
      }
    },
    noData: {
      position: {
        x: -140,
        y: -20
      }
    },
    exporting: {
      sourceWidth: 831,
      scale: 1
    }
  }
}

export const createGaugeChartConfig = (title, height) => {
  const baseConfig = createConfig(title, '', height)
  return {
    ...baseConfig,
    tooltip: {
      ...baseConfig.tooltip,
      enabled: false
    },
    plotOptions: {
      ...baseConfig.plotOptions,
      series: {
        shadow: false,
        borderColor: null,
        borderWidth: 1
      },
      pie: {
        dataLabels: {
          distance: -18,
          style: {
            textOutline: false,
            fontSize: '26px'
          }
        },
        size: '230%', //scale graph size, greater makes larger
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '105%'],
        shadow: false,
        states: {
          hover: {
            enabled: false
          }
        }
      }
    },
    title: {
      ...baseConfig.title,
      align: 'left',
      y: 20
    },
    subtitle: {
      ...baseConfig.subtitle,
      align: 'center',
      verticalAlign: 'bottom',
      y: -40,
      style: { "fontSize": "48px", "color": "#333" }
    }
  }
}

export const createConfig = (title, subtitle, height) => {
  const config = {
    title: {
      text: title
    },
    subtitle: {
      text: subtitle
    },
    chart: {
      height
    },
    colors: defaultColors,
    tooltip: {
      useHTML: true,
      hideDelay: 200,
      headerFormat: '<span style="color:{point.color}">{point.key}</span>'
    },
    drilldown: {
      drillUpButton: {
        relativeTo: 'spacingBox',
        position: {
          align: 'right',
          verticalAlign: 'top',
          x: 10,
          y: 50
        }
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.y}',
          distance: 10,
          style: {
            textOutline: false
          }
        }
      }
    },
    exporting: {
      sourceHeight: height,
      scale: 1
    }
  }

  return config
}

export const componentDidUpdate = (component) => {
  const { state, refs, props } = component

  // Fix for allowing animations after fetching
  if (refs.chart) {
    const chart = refs.chart.getChart()
    const chartReflow = chart.reflow
    chart.reflow = () => { }
    setTimeout(() => (chart.reflow = chartReflow))
  }

  if (!props.chart)
    return

  const series = props.chart.Series
  const seriesHasChange = state.series !== series

  // Dynamically calculate the responsive width of the chart
  const width = document.querySelector('#' + props.id).clientWidth || props.height
  const widthHasChange = state.exporting.sourceWidth !== width
  const drilldown = props.chart.DrilldownSeries
  const drilldownHasChange = state.drilldown.series !== drilldown
  const hasDrilldown = Array.isArray(drilldown) && drilldown.length > 0

  if (props.onClick)
    addSeriesClickHandler(hasDrilldown ? drilldown : series, props.onClick)

  if (hasDrilldown && !drilldownHasChange && !seriesHasChange && !widthHasChange)
    return

  if (!hasDrilldown && !seriesHasChange && !widthHasChange)
    return

  let updatedState = {
    series,
    subtitle: {
      ...state.subtitle,
      text: props.subtitle
    },
    exporting: {
      sourceWidth: width,
      scale: 1
    }
  }

  if (hasDrilldown) {
    updatedState = {
      ...updatedState,
      drilldown: {
        ...state.drilldown,
        series: drilldown
      }
    }
  }

  component.setState(updatedState)
}
