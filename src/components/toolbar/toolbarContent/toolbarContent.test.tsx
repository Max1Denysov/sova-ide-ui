import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarContent from './toolbarContent'

describe('ToolbarContent tests', () => {
  let component: ShallowWrapper
  const compMock = React.memo(() => <div>TEST</div>)
  const propsMock = {
    toolbarFrame: compMock,
    isUtilityEnabled: false,
  }

  beforeEach(() => {
    component = shallow(<ToolbarContent {...propsMock} />)
  })

  it('*UNIT* renders without crashing on any auth status', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing on any auth status with different props', () => {
    component.setProps({ isUtilityEnabled: true })
    expect(component.exists()).toEqual(true)
  })
})
