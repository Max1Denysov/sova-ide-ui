import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import CompilationContainer from './compilationContainer'

describe('CompilationContainer tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<CompilationContainer/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})