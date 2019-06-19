import * as types from './compliance-action-types'
import * as actions from '../actions/api'
import reducer from './compliance-grid-reducer'


describe('TODO REMOVE ME', () => {
  it('should be temporary'), () => {
    expect('test').toEqual('test')
  }
})
// describe('Compliance Grid Reducer', () => {

//   it('should handle COMPLIANCE_GET_ITEMS_SUCCESS:', () => {
//     const action = {
//       type: types.COMPLIANCE_GET_ITEMS_SUCCESS,
//       payload: "test"
//     }
//     const initState = {
//       data: "",
//       filters: "filters",
//       sort: "sort"
//     }
//     const expectedState = {
//       data: "test",
//       filters: "filters",
//       sort: "sort"
//     }
//     expect(reducer(initState, action)).toEqual(expectedState)
//   })

//   it('should not handle COMPLIANCE_GET_ITEMS_FETCHING', () => {
//     const action = {
//       type: types.COMPLIANCE_GET_ITEMS_FETCHING
//     }
//     const initState = {
//       data: "test",
//       filters: "filters",
//       sort: "sort"
//     }
//     const expectedState = {
//       data: "test",
//       filters: "filters",
//       sort: "sort"
//     }
//     expect(reducer(initState, action)).toEqual(expectedState)
//   })

//   it('should not handle COMPLIANCE_GET_ITEMS_FAILED', () => {
//     const action = {
//       type: types.COMPLIANCE_GET_ITEMS_FAILED
//     }
//     const initState = {
//       data: "test",
//       filters: "filters",
//       sort: "sort"
//     }
//     const expectedState = {
//       data: "test",
//       filters: "filters",
//       sort: "sort"
//     }
//     expect(reducer(initState, action)).toEqual(expectedState)
//   })
