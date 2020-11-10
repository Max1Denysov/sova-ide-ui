import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import OutBoundClick from './outBoundClick'

describe('OutBoundClick tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    onClick: jest.fn(),
    className: 'test',
    exceptions: ['test1', 'test2'],
    outboundClickEnabled: true
  }

  beforeEach(() => {
    component = shallow(
      <OutBoundClick {...propsMock}>
        <div>TEST</div>
      </OutBoundClick>
    )
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ outboundClickEnabled: false })
    expect(component.exists()).toEqual(true)
  })
})