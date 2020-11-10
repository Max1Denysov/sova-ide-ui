import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import Navbar from './navbar'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'

describe('Navbar tests', () => {
  let component: ShallowWrapper

  const props = {
    currentUserRole: 'user',
  }

  beforeEach(() => {
    component = shallow(
      <Provider store={store}>
        <Navbar {...props} />
      </Provider>
    )
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ clicked: true, activeItem: 0 })
    expect(component.exists()).toEqual(true)
  })
})
