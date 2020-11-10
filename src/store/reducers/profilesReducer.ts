import { Map } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { ProfileItem } from '../../components/menu/menuSelect/menuSelect'
import { RandomObject } from '../../@types/common'

const initialState = Map({
  selectedProfile: {},
  selectedAccount: Map(),
  selectedAccountComplect: Map(),
})

const profilesReducer = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),
  [actionTypes.PROFILE_IS_SELECTED]: (state: Map<any, any>, action: { type: string; payload: ProfileItem | null }) =>
    state.update('selectedProfile', () => action.payload || {}),
  [actionTypes.SELECT_ACCOUNT]: (state: Map<any, any>, action: { type: string; account: Map<any, any> }) =>
    state.update('selectedAccount', () => action.account),
  [actionTypes.SELECTED_ACCOUNT_COMPLECT]: (state: Map<any, any>, action: { type: string; complect: Map<any, any> }) =>
    state.update('selectedAccountComplect', () => action.complect),
}

export default (state = initialState, action: RandomObject) => createReducer(profilesReducer, state, action)
