import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import CustomVirtualScrollbar from '../customVirtualScrollbar'

describe('CustomVirtualScrollbar tests', () => {
  let component: ShallowWrapper
  let instance: CustomVirtualScrollbar

  const TestComp = React.memo<{ index: number; style: { [key: string]: any } }>(({ index, style }) => (
    <div key={index} style={style}>
      TEST
    </div>
  ))

  const propsMock = {
    scrollbarsClassName: 'scrollbarsClassName',
    containerClassName: 'containerClassName',
    itemsCount: 50,
    itemHeight: 20,
    /* customHeightConfig: { string: 0 },
    propToTriggerUpdate: {},
    getCustomHeight: jest.fn(),
    onScroll: jest.fn(),
    children: TestComp, */
  }

  beforeEach(() => {
    component = shallow(<CustomVirtualScrollbar {...propsMock}></CustomVirtualScrollbar>)
    instance = component.instance() as CustomVirtualScrollbar
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the internal method while rendering', () => {
    instance.getItemSize(1)
    expect(instance.getItemSize(1)).toEqual(propsMock.itemHeight)
  })

  it('calls the internal method while rendering', () => {
    const customFuncMock = jest.fn()
    component.setProps({ getCustomHeight: customFuncMock })
    jest.spyOn(instance, 'getItemSize')
    instance.getItemSize(1)
    expect(customFuncMock).toHaveBeenCalledTimes(1)
  })

  it('calls the internal method while rendering', () => {
    component.setProps({ customHeightConfig: { 1: 5 } })
    jest.spyOn(instance, 'getItemSize')
    instance.getItemSize(1)
    expect(instance.getItemSize).toHaveBeenCalledTimes(1)
  })
})
