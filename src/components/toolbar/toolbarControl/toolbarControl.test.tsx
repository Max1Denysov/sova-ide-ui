import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarControl from './toolbarControl'

describe('ToolbarControl tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<ToolbarControl/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})