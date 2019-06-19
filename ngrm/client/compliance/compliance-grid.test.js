import React from 'react'
import { shallow } from 'enzyme'
import TableView, {
  Pager,
  TotalCount,
  DetailLinkCell,
  TextCell,
  SortableHeader,
  TextFilterHeader,
  SelectFilterHeader,
  stringComparator,
  dateComparator,
  textFilter,
  equalsFilter
} from '../components/table'
import {
  PieChart
} from '../components/charts'
import { SecuredLinkButton as LinkButton } from '../components/buttons/link-button'
import { SecureExportButton as ExportButton } from '../components/buttons/export-button'
import FileImport from '../components/file-import'
import ComplianceGrid from './compliance-grid'
import * as routes from '../constants/routes'
import * as endpoints from '../constants/endpoints'


describe("Compliance Grid", () => {
  let props
  const mockOnDelete = jest.fn()
  const mockFilterHandler = jest.fn()
  const shouldFilter = (key, filter, value) => {
    // should clear filters first
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('SectionTitle', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('Rule', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('CmmiStatus', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('Compliant', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('RemediationResource', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    expect(props.table.handleFilterChange).toHaveBeenCalledWith('RemediationDate', textFilter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value: '' } })
    // should set filter value
    expect(props.table.handleFilterChange).toHaveBeenCalledWith(key, filter)
    expect(mockFilterHandler).toHaveBeenCalledWith({ target: { value } })
  }

  beforeEach(() => {
    props = {
      engagementId: 'engagementId',
      schemeId: 'schemeId',
      entitlements: {
        Add: 0,
        Export: 0,
        Import: 0,
        Remove: 0
      },
      charts: {},
      table: {
        currentPageIndex: 0,
        pageSize: 10,
        sort: {},
        filters: {},
        filteredAndSorted: [],
        page: [],
        fetchRows: jest.fn(),
        handleSort: jest.fn(),
        handleFilterChange: jest.fn().mockReturnValue(mockFilterHandler),
        handlePageChange: jest.fn().mockReturnValue('handlePageChange'),
        handlePageSize: jest.fn().mockReturnValue('handlePageSize'),
        deleteRow: mockOnDelete
      },
      actions: {
        handleUpload: jest.fn().mockReturnValue(jest.fn()),
        handleDelete: jest.fn().mockReturnValue(mockOnDelete)
      }
    }
  })

  it('should render Maturity Level pie chart first', () => {
    props.charts = {
      byMaturityLevelChart: { value: 'maturityLevelChart' }
    }

    const subject = shallow(<ComplianceGrid {...props} />).find(PieChart).at(0)
    expect(subject.props().title).toEqual("Maturity Levels")
    expect(subject.props().subtitle).toEqual("Click the slice to view by maturity")
    expect(subject.props().height).toEqual("300")
    expect(subject.props().className).toEqual("col-md-6")
    expect(subject.props().chart.value).toEqual("maturityLevelChart")

    const event = {
      point: { name: "maturity" }
    }
    subject.props().onClick(event)
    shouldFilter('CmmiStatus', equalsFilter, 'maturity')
  })

  it('should render Compliant pie chart second', () => {
    props.charts = {
      byGapReviewChart: { value: 'gapReviewChart' }
    }

    const subject = shallow(<ComplianceGrid {...props} />).find(PieChart).at(1)
    expect(subject.props().title).toEqual("Gap Review")
    expect(subject.props().subtitle).toEqual("Click the slice to view by gap")
    expect(subject.props().height).toEqual("300")
    expect(subject.props().className).toEqual("col-md-6")
    expect(subject.props().chart.value).toEqual("gapReviewChart")

    const event = {
      point: { name: 'compliant' }
    }
    subject.props().onClick(event)
    shouldFilter('Compliant', equalsFilter, 'compliant')
  })

  it('should render total count', () => {
    props.table.filteredAndSorted = [1, 2]
    const subject = shallow(<ComplianceGrid {...props} />).find(TotalCount)
    expect(subject.props().totalRowCount).toEqual(props.table.filteredAndSorted.length)
    expect(subject.props().label).toEqual('Total compliance rule(s)')
  })

  it('should render export button', () => {
    const subject = shallow(<ComplianceGrid {...props} />).find(ExportButton)
    expect(subject.props().entitlement).toEqual(props.entitlements.Export)
    expect(subject.props().exportURL).toEqual(endpoints.EXPORT_COMPLIANCE)
    expect(subject.props().engagementId).toEqual('engagementId')
    expect(subject.props().schemeId).toEqual('schemeId')
    expect(subject.props().name).toEqual('Compliance Rules')
  })

  it('should render add compliance button', () => {
    const subject = shallow(<ComplianceGrid {...props} />).find(LinkButton)
    expect(subject.props().entitlement).toEqual(props.entitlements.Add)
    expect(subject.props().route).toEqual(routes.COMPLIANCE_PAGE + '/engagementId/schemeId/0')
    expect(subject.props().label).toEqual('Add Compliance Rule')
  })

  it('should render import button', () => {
    const subject = shallow(<ComplianceGrid {...props} />).find(FileImport)
    expect(subject.props().accept).toEqual('.csv')
    expect(subject.props().engagementId).toEqual('engagementId')
    expect(subject.props().schemeId).toEqual('schemeId')
    expect(subject.props().onUpload).toBeDefined()
  })

  it('should render Table View', () => {
    props.table.sort = {
      SectionTitle: 'sortSectionTitle',
      Rule: 'sortRule',
      CmmiStatusId: 'sortMaturityLevel',
      CompliantStatusId: 'sortCompliantStatus'
    }
    props.table.filters = {
      SectionTitle: { value: 'filterSectionTitle' },
      Rule: { value: 'filterRule' },
      CmmiStatus: { value: 'filterMaturityLevel' },
      Compliant: { value: 'filterCompliant' }
    }

    const subject = shallow(<ComplianceGrid {...props} />).find(TableView)
    expect(subject.props().page).toEqual(props.table.page)
    expect(subject.props().onDelete).toEqual(mockOnDelete)

    const expectedColumns = [
      {
        title: 'Title',
        field: 'SectionTitle',
        sortField: 'SectionTitle',
        header: { component: SortableHeader, sort: 'sortSectionTitle', comparator: stringComparator },
        filter: { component: TextFilterHeader, value: 'filterSectionTitle', filter: textFilter },
        cell: { component: TextCell }
      },
      {
        title: 'Rule',
        field: 'Rule',
        sortField: 'Rule',
        header: { component: SortableHeader, sort: 'sortRule', comparator: stringComparator },
        filter: { component: TextFilterHeader, value: 'filterRule', filter: textFilter },
        cell: { component: DetailLinkCell }
      },
      {
        title: 'Maturity Level',
        field: 'CmmiStatus',
        sortField: 'CmmiStatusId',
        header: { component: SortableHeader, sort: 'sortMaturityLevel', comparator: stringComparator },
        filter: { component: SelectFilterHeader, value: 'filterMaturityLevel', filter: equalsFilter },
        cell: { component: TextCell }
      },
      {
        title: 'Compliance',
        field: 'Compliant',
        sortField: 'CompliantStatusId',
        header: { component: SortableHeader, sort: 'sortCompliantStatus', comparator: stringComparator },
        filter: { component: SelectFilterHeader, value: 'filterCompliant', filter: equalsFilter },
        cell: { component: TextCell }
      }
    ]

    expectedColumns.forEach((expected, i) => {
      const header = subject.props().headers[i]
      expect(header.component).toEqual(expected.header.component)
      expect(header.props.title).toEqual(expected.title)
      expect(header.props.sort).toEqual(expected.header.sort)
      expect(props.table.handleSort).toHaveBeenCalledWith(expected.sortField, expected.header.comparator)

      const filter = subject.props().filters[i]
      expect(filter.component).toEqual(expected.filter.component)
      expect(filter.props.value).toEqual(expected.filter.value)
      expect(props.table.handleFilterChange).toHaveBeenCalledWith(expected.field, expected.filter.filter)

      const cell = subject.props().cells('row')[i]
      expect(cell.component).toEqual(expected.cell.component)
      expect(cell.props.item).toEqual('row')
      expect(cell.props.col.field).toEqual(expected.field)
    })
  })

  it('should render pager', () => {
    const subject = shallow(<ComplianceGrid {...props} />)
    expect(subject.find(Pager).props().pageSize).toEqual(10)
    expect(subject.find(Pager).props().totalRowCount).toEqual(props.table.filteredAndSorted.length)
    expect(subject.find(Pager).props().currentPageIndex).toEqual(0)
    expect(subject.find(Pager).props().handlePageChange()).toEqual('handlePageChange')
    expect(subject.find(Pager).props().handlePageSize()).toEqual('handlePageSize')
  })

})
