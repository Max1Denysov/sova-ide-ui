import React from 'react'
import { shallow } from 'enzyme'
import NotFoundRoute from '../notFoundRoute'

describe('NotFoundRoute tests', () => {
  it('*UNIT* renders without crashing', () => {
    const component = shallow(<NotFoundRoute/>)
    expect(component.exists()).toEqual(true)
  })
})
