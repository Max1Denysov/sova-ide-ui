import { createReducer } from './storeUtiles'
import { Map } from 'immutable'

describe('StoreUtiles tests', () => {
  it('successfully updates reducer with provided state and action', () => {
    const reducerMock: {
      [key: string]: (state: Map<any, any>, action: { type: string; payload: boolean }) => Map<any, any>
    } = {
      TYPE_MOCK: (state: Map<any, any>, action: { type: string; payload: boolean }) =>
        state.update('testState', () => action.payload),
    }
    const stateMock = Map({
      testState: false
    })
    const actionMock1: { payload: boolean } = {
      payload: true,
    }
    const actionMock2: { type: string, payload: boolean } = {
      type: 'TYPE_MOCK',
      payload: true,
    }
    expect(createReducer(reducerMock, stateMock, actionMock1)).toEqual(stateMock)
    expect(createReducer(reducerMock, stateMock, actionMock2)).toEqual(reducerMock[actionMock2.type](stateMock, actionMock2))
  })
})