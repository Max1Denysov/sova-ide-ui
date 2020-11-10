import * as types from '../../actions/actionTypes'
import statusbarReducer from '../statusbarReducer'
import { Map, List } from 'immutable'

describe('StatusbarReducer tests', () => {
  it('should return the updated state', () => {
    const initialState = Map({
      showNotification: false,
      data: { msg: 'Привет', error: false },
    })
    const action1 = {
      type: types.STATUS_BAR_NOTIFICATION,
      status: true,
      data: { msg: 'Изменения успешно сохранены!', hideAfter: 2000 },
    }
    const expectedState1 = Map({
      showNotification: action1.status,
      data: action1.data,
    })
    const action2 = {
      type: types.STATUS_BAR_NOTIFICATION,
      status: false,
    }
    const expectedState2 = Map({
      showNotification: action2.status,
      data: {},
    })
    expect(statusbarReducer(initialState, action1)).toEqual(expectedState1)
    expect(statusbarReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      showSyncNotification: false,
      syncData: {},
    })
    const action1 = {
      type: types.STATUS_BAR_SYNCING,
      status: true,
      data: { classList: 'sync', msg: 'Синхронизирую...' },
    }
    const expectedState1 = Map({
      showSyncNotification: action1.status,
      syncData: action1.data,
    })
    const action2 = {
      type: types.STATUS_BAR_SYNCING,
      status: false,
    }
    const expectedState2 = Map({
      showSyncNotification: action2.status,
      syncData: {},
    })
    expect(statusbarReducer(initialState, action1)).toEqual(expectedState1)
    expect(statusbarReducer(initialState, action2)).toEqual(expectedState2)
  })
})