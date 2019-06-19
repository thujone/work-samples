import * as types from './compliance-action-types'

export const initState = {
  currentPageIndex: 0,
  pageSize: 10,
  filters: {},
  sort: {},
  data: [],
  importForm: {
    file: null
  },
  importSummary: '',
  errorMessage: '',
  fieldErrors: {}
}

const complianceGridReducer = (state = initState, action) => {
  switch (action.type) {
    case types.COMPLIANCE_GET_ITEMS_SUCCESS:
      const complianceData = {}
      if (action.payload.length > 0) {
        const schemeId = action.payload[0].SchemeId.toString()
        complianceData[schemeId] = action.payload

        // Filter out the old row of data (if any) from this complianceScheme
        let updatedData = state.data.filter(row => {
          return Object.keys(row)[0] !== schemeId
        })
        // Concat the new row of data for this complianceScheme
        updatedData = updatedData.concat(complianceData) 

        return {
          ...state,
          data: updatedData
        }
      }
      else {
        return {
          ...state
        }
      }
    case types.COMPLIANCE_SORT:
      let localSort = {}

      // toggle sort direction from asc to desc for field
      if (state.sort[action.field] && state.sort[action.field].direction === "asc") {
        localSort[action.field] = {
          direction: "desc",
          comparator: action.comparator
        }
      }
      else {
        // set sort direction asc for field
        localSort[action.field] = {
          direction: "asc",
          comparator: action.comparator
        }
      }

      return {
        ...state,
        sort: localSort,
        currentPageIndex: 0
      }
    case types.COMPLIANCE_FILTER:
      const localFilters = {
        ...state.filters
      }

      // update field filter value only when not empty
      if (action.value && action.value !== "") {
        localFilters[action.field] = {
          value: action.value,
          filter: action.filter
        }
      } else {
        // remove field filter when empty
        delete localFilters[action.field]
      }

      return {
        ...state,
        filters: localFilters,
        currentPageIndex: 0
      }
    case types.COMPLIANCE_PAGE_SIZE_CHANGE:
      return {
        ...state,
        pageSize: action.size
      }
    case types.COMPLIANCE_PAGE_INDEX_CHANGE:
      return {
        ...state,
        currentPageIndex: action.index
      }
    case types.COMPLIANCE_IMPORT_CLICK:
      return {
        ...state
      }
    case types.COMPLIANCE_IMPORT_FILE_CHANGE:
      return {
        ...state,
        importForm: {
          ...state.importForm,
          file: action.value
        }
      }
    case types.COMPLIANCE_POST_IMPORT_SUCCESS:
      return {
        ...state,
        importForm: initState.importForm,
        importSummary: action.payload,
        errorMessage: initState.errorMessage,
        fieldErrors: initState.fieldErrors
      }
    case types.COMPLIANCE_POST_IMPORT_FAILED:
      return {
        ...state,
        errorMessage: action.errorMessage,
        fieldErrors: action.fieldErrors
      }
    case types.COMPLIANCE_IMPORT_CANCEL:
      return {
        ...state,
        importForm: initState.importForm,
        importSummary: initState.importSummary,
        errorMessage: initState.errorMessage,
        fieldErrors: initState.fieldErrors
      }
    case types.COMPLIANCE_SCHEMES_GET_ITEMS_SUCCESS:
      return {
        ...state,
        complianceSchemes: action.payload
      }
    case types.COMPLIANCE_SCHEMES_ADD_SUCCESS:
      return {
        ...state,
        complianceSchemes: [...state.complianceSchemes, action.payload]
      }
    default:
      return state
  }
}

export default complianceGridReducer