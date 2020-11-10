import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import Toggle from '../toggle'

describe('Toggle tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    id: 'id',
    value: false,
    handler: jest.fn(),
    disabled: false,
  }

  beforeEach(() => {
    component = shallow(<Toggle {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ disabled: true })
    expect(component.exists()).toEqual(true)
  })

  it('calls function from props when triggering change event', () => {
    component.find('input').simulate('change')
    expect(propsMock.handler).toBeCalledTimes(1)
  })
})