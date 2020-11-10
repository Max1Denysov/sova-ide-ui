import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarReplaceEndings from './toolbarReplaceEndings'
import { OrderedSet } from 'immutable'

describe('ToolbarReplaceEndings tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<ToolbarReplaceEndings/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setState({ words: OrderedSet(['первый', 'второй', 'третий']) })
    expect(component.exists()).toEqual(true)
  })
})