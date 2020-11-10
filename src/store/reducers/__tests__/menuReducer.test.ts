import * as types from '../../actions/actionTypes'
import menuReducer from '../menuReducer'
import { Map, Set, fromJS } from 'immutable'

describe('MenuReducer tests', () => {
  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        searchValues: {
          category: [],
        },
      })
    )
    const action = {
      type: types.SET_SEARCH_VALUES,
      category: 'category',
      payload: ['value1', 'value2'],
    }
    const expectedState = Map(
      fromJS({
        searchValues: {
          category: action.payload,
        },
      })
    )
    expect(menuReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      customConfirm: Map({
        customConfirm: {
          active: false,
          onConfirm: () => {},
          activeName: '',
          title: '',
        },
      }),
    })
    const action = {
      type: types.CUSTOM_CONFIG_NOTIFICATION,
      customConfirm: {},
    }
    const expectedState = Map(
      fromJS({
        customConfirm: action.customConfirm,
      })
    )
    expect(menuReducer(initialState, action)).toEqual(expectedState)
  })

  /* it('should return the updated state', () => {
    const initialState = Map({
      selectedAccountProfiles: Set(),
    })
    const action = {
      type: types.SELECTED_ACCOUNT_PROFILES,
      profiles: Set(['profile1', 'profile2']),
    }
    const expectedState = Map(
      fromJS({
        selectedAccountProfiles: action.profiles,
      })
    )
    expect(menuReducer(initialState, action)).toEqual(expectedState)
  }) */
})
