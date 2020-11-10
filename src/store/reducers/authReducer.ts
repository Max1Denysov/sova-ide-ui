import { Map, fromJS } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { RandomObject } from '../../@types/common'

const initialState = Map(fromJS({ isAuth: false, user: {}, token: '' }))

const authReducer = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),
  [actionTypes.SAVE_AUTHENTICED_USER]: (
    state: Map<any, any>,
    payload: { type: string; data: { user: RandomObject, jwt: string } }
  ) => {
    return state
      .update('isAuth', () => true)
      .update('user', () => Map(fromJS((payload.data.user))))
      .update('token', () => payload.data.jwt)
  },
}

export default (state = initialState, action: RandomObject) => createReducer(authReducer, state, action)
