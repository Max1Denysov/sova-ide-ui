import * as types from '../../actions/actionTypes'
import settingsReducer from '../settingsReducer'
import { Map, fromJS } from 'immutable'
import { settingsConfig } from '../../../routes/configs/settingsConfig'

describe('SettingsReducer tests ', () => {
  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        userSettings: {
          common: {},
          profile: {},
        },
      })
    )
    const action = {
      type: types.UPDATE_SETTINGS,
      payload: Map(fromJS(settingsConfig)),
    }
    const expectedState = Map(
      fromJS({
        userSettings: action.payload,
      })
    )
    expect(settingsReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        errorMessage: '',
      })
    )
    const action = {
      type: types.STORE_ERROR_MESSAGE,
      error: 'Some error message',
    }
    const expectedState = Map(
      fromJS({
        errorMessage: action.error,
      })
    )
    expect(settingsReducer(initialState, action)).toEqual(expectedState)
  })
})
