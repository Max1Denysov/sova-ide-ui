import React from 'react'
import { shallow } from 'enzyme'
import { Login, Home, NotFound } from './index'

describe('Routes tests', () => {
  it('*UNIT* renders without crashing', () => {
    const component = shallow(<Login/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<Home/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<NotFound/>)
    expect(component.exists()).toEqual(true)
  })
})