import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import CustomSelect from '../customSelect'
import { Map, List } from 'immutable'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCaretDown, faCheckCircle)

describe('CustomSelect tests', () => {
  let component: ShallowWrapper
  let instance: CustomSelect
  let instance1: CustomSelect
  const propsMock = {
    group: 'group',
    id: 'id',
    value: Map(),
    options: List([
      Map({ name: 'Общий', value: 'common', isCommon: true }),
      Map({ name: 'Уникальный', value: 'unique', isCommon: false }),
    ]),
    updateValue: jest.fn(),
    onSelect: jest.fn(),
    multiSelect: true,
    hideMultiTags: true,
    disabled: false,
    defaultPlaceholder: 'string',
    itemHeight: 0,
    itemsVisible: 0,
  }

  beforeEach(() => {
    component = shallow(<CustomSelect {...propsMock} />)
    instance = component.instance() as CustomSelect
  })

  it('*UNIT* renders without crashing ', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      value: Map({
        value: 'value',
      }),
    })
    expect(component.exists()).toEqual(true)
  })

  it('calls the right method by clicking on certain element', () => {
    jest.spyOn(instance, 'setDropDown').mockImplementation(jest.fn())
    instance.forceUpdate()
    component.find('.custom-select-visible').simulate('click')
    expect(instance.setDropDown).toHaveBeenCalledTimes(1)
  })

  it('updates the state by clicking on certain element', () => {
    const prevState = instance.state.isDroppedDown
    component.find('.custom-select-visible').simulate('click')
    expect(instance.state.isDroppedDown).toEqual(!prevState)
  })

  it('calls the right method by clicking on select-wrapper', () => {
    const wrapper = mount(<CustomSelect {...propsMock} />)
    instance1 = wrapper.instance() as CustomSelect
    jest.spyOn(instance1, 'onSelectDropDownItem').mockImplementation(jest.fn())
    instance1.forceUpdate()
    wrapper.find('.custom-select-visible').simulate('click')
    wrapper.find('.dropdown-item').first().simulate('click')
    expect(instance1.onSelectDropDownItem).toHaveBeenCalledTimes(1)
  })

  it('doesnt call props functions by selecting a dropdown-item when if-statement is falsy', () => {
    const wrapper = mount(<CustomSelect {...propsMock} />)
    wrapper.setProps({
      updateValue: undefined,
      onSelect: undefined,
    })
    wrapper.find('.custom-select-visible').simulate('click')
    wrapper.find('.dropdown-item').first().simulate('click')
    expect(propsMock.updateValue).toHaveBeenCalledTimes(0)
    expect(propsMock.onSelect).toHaveBeenCalledTimes(2)
  })

  it('calls props functions by selecting a dropdown-item', () => {
    const wrapper = mount(<CustomSelect {...propsMock} />)
    wrapper.find('.custom-select-visible').simulate('click')
    wrapper.find('.dropdown-item').first().simulate('click')
    expect(propsMock.updateValue).toHaveBeenCalledTimes(1)
    expect(propsMock.onSelect).toHaveBeenCalledTimes(4)
  })
})
