import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarSearch from '../toolbarSearch'

describe('ToolbarSearch tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    category: 'category'
  }

  beforeEach(() => {
    component = shallow(<ToolbarSearch {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})