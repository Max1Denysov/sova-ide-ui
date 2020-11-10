import * as types from '../../actions/actionTypes'
import profilesReducer from '../profilesReducer'
import { Map } from 'immutable'

describe('ProfilesReducer tests', () => {
  it('should return the updated state', () => {
    const initialState = Map({
      selectedProfile: {
        id: 'id1',
        name: 'name1',
        is_enabled: true,
        permissions: {
          dl_read: true,
          dl_write: true,
          dict_read: true,
          dict_write: true,
        },
      },
    })
    const action1 = {
      type: types.PROFILE_IS_SELECTED,
      payload: {
        id: 'id2',
        name: 'name2',
        is_enabled: true,
        permissions: {
          dl_read: true,
          dl_write: true,
          dict_read: false,
          dict_write: false,
        },
      },
    }
    const expectedState1 = Map({
      selectedProfile: action1.payload
    })
    const action2 = {
      type: types.PROFILE_IS_SELECTED,
      payload: null,
    }
    const expectedState2 = Map({
      selectedProfile: {},
    })
    expect(profilesReducer(initialState, action1)).toEqual(expectedState1)
    expect(profilesReducer(initialState, action2)).toEqual(expectedState2)
  })
})