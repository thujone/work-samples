import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsData from 'highcharts/modules/data'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting'
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import './chart.css'

// Configure More Module Once
if (!ReactHighcharts.Highcharts.seriesTypes['gauge']) {
  HighchartsMore(ReactHighcharts.Highcharts)
}

// Configure Exporting Module Once
if (!ReactHighcharts.Highcharts.Chart.prototype.exportChart) {
  HighchartsData(ReactHighcharts.Highcharts)
  HighchartsExporting(ReactHighcharts.Highcharts)
  HighchartsOfflineExporting(ReactHighcharts.Highcharts)
}

// Configure No Data To Display Module Once
if (!ReactHighcharts.Highcharts.Chart.prototype.hideNoData) {
  HighchartsNoDataToDisplay(ReactHighcharts.Highcharts)
}

// Configure Drilldown Module Once
if (!ReactHighcharts.Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  HighchartsDrilldown(ReactHighcharts.Highcharts)
  // ReactHighcharts.Highcharts.setOptions({
  //   lang: {
  //     drillUpText: 'Drill up {series.name}'
  //   }
  // })
}

export default ReactHighcharts
