import { Map } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { StatusBarDataProps } from '../../components/statusBar/statusBar'
import { RandomObject } from '../../@types/common'

const initialState = Map({
  showNotification: false,
  data: {},
  showSyncNotification: false,
  syncData: {},
})

const statusBar = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),
  [actionTypes.STATUS_BAR_NOTIFICATION]: (state: Map<any, any>, payload: { type: string; data: StatusBarDataProps; status: boolean }) => {
    return state
      .set('data', payload.data || {})
      .update('showNotification', () => payload.status)
  },
  [actionTypes.STATUS_BAR_SYNCING]: (state: Map<any, any>, payload: { type: string; data: StatusBarDataProps; status: boolean; }) => {
    return state
      .set('syncData', payload.data || {})
      .update('showSyncNotification', () => payload.status)
  },
}

export default (state = initialState, action: RandomObject) => createReducer(statusBar, state, action)
