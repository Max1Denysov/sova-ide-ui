import { Map } from 'immutable'
import { RandomObject } from '../../@types/common'

export const createReducer = (reducer: RandomObject, state: Map<any, any>, action: RandomObject) =>
  reducer[action.type] ? reducer[action.type](state, action) : state
