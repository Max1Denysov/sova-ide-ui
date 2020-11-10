import { Map, List, fromJS } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { RandomObject } from '../../@types/common'
import { CustomConfirmData } from '../../components/common/customConfirm'

const initialState = Map(
  fromJS({
    searchValues: {
      suites: [],
      dictionaries: [],
      editors: [],
    },
    customConfirm: {
      active: false,
      onConfirm: () => {},
      activeName: '',
      title: '',
    },
  })
)

const menuReducer = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),
  [actionTypes.SET_SEARCH_VALUES]: (
    state: Map<any, any>,
    action: { type: string; category: string; payload: string[] }
  ) => state.update('searchValues', (value: Map<any, any>) => value.set(action.category, List(action.payload))),
  [actionTypes.CUSTOM_CONFIG_NOTIFICATION]: (state: Map<any, any>, payload: { data: CustomConfirmData }) =>
    state.update('customConfirm', () => Map(fromJS(payload.data))),
}

export default (state = initialState, action: RandomObject) => createReducer(menuReducer, state, action)
