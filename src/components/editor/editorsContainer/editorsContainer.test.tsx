import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import EditorsContainer from './editorsContainer'

describe('EditorsContainer tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<EditorsContainer/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})