import * as types from '../../actions/actionTypes'
import authReducer from '../authReducer'
import { Map, fromJS } from 'immutable'

describe('AuthReducer tests', () => {
  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      isAuth: true,
      user: { uuid: 'uuid' },
      token: 'jwt',
    }))
    const action = {
      type: types.LOGOUT_USER,
    }
    const expectedState = Map(fromJS({
      isAuth: false,
      user: {},
      token: '',
    }))
    expect(authReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      isAuth: false,
      user: {},
      token: '',
    }))
    const action = {
      type: types.SAVE_AUTHENTICED_USER,
      data: {
        user: { uuid: 'uuid' },
        jwt: 'jwt',
      },
    }
    const expectedState = Map({
      isAuth: true,
      user: Map(fromJS(action.data.user)),
      token: action.data.jwt,
    })
    expect(authReducer(initialState, action)).toEqual(expectedState)
  })
})