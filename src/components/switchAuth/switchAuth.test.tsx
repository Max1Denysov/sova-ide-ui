import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { SwitchAuth, mapStateToProps } from './switchAuth'
import { Map, fromJS } from 'immutable'
import CustomRoute from '../common/customRoute'

describe('SwitchAuth tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    isAuth: true,
  }
  const stateMock = {
    auth: Map(fromJS(propsMock)),
  }

  beforeEach(() => {
    component = shallow(<SwitchAuth {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
    expect(component.containsMatchingElement(<CustomRoute />)).toEqual(true)
  })


  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ isAuth: false })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
