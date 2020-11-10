import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import EditorsUpdates from './editorsUpdates'

describe('EditorsUpdates tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    lastUpdated: 1,
    lastUser: {
      uuid: 'uuid',
      name: 'name',
      username: 'username',
      user_role: 'user_role',
    },
  }

  beforeEach(() => {
    component = shallow(<EditorsUpdates {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ lastUser: { name: 'name', username: null } })
    expect(component.exists()).toEqual(true)

    component.setProps({ lastUser: { name: null, username: 'username' } })
    expect(component.exists()).toEqual(true)

    component.setProps({ lastUser: { name: null, username: null } })
    expect(component.exists()).toEqual(true)

    component.setProps({ lastUser: null })
    expect(component.exists()).toEqual(true)
  })
})