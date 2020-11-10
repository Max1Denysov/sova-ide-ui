import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import VirtualListScrollbar, { DefaultVirtualListScrollbar } from '../virtualListScrollBar'

describe('VirtualListScrollbar tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    onScroll: jest.fn(),
    forwardedRef: React.createRef<HTMLDivElement>(),
    style: {
      color: '#fff'
    }
  }

  beforeEach(() => {
    component = shallow(
      <VirtualListScrollbar {...propsMock}>
        <div>TEST</div>
      </VirtualListScrollbar>
    )
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const defaultComp = shallow(
      <DefaultVirtualListScrollbar {...propsMock}>
        <div>TEST</div>
      </DefaultVirtualListScrollbar>
    )
    expect(defaultComp.exists()).toEqual(true)
  })
})