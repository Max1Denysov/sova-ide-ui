import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import HomeLoader from './homeLoader'

describe('HomeLoader tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<HomeLoader/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})