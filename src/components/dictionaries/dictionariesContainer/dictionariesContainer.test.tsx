import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import DictionariesContainer from './dictionariesContainer'

describe('DictionariesContainer tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<DictionariesContainer/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})