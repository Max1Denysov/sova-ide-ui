import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import CustomScrollbar from '../customScrollbar'
import Scrollbars from 'react-scrollbars-custom'

describe('CustomScrollbar tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    scrollbarEnabled: true,
    innerRef: React.createRef<Scrollbars>()
  }

  beforeEach(() => {
    component = shallow(<CustomScrollbar {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ scrollbarEnabled: false })
    expect(component.exists()).toEqual(true)
  })
})