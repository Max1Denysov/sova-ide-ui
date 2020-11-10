import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import CustomInput from '../customInput'

describe('CustomInput tests', () => {
  let component: ShallowWrapper
  let instance: CustomInput
  const propsMock = {
    group: 'group',
    id: 'id',
    value: '',
    updateValue: jest.fn(),
    disabled: false,
  }

  beforeEach(() => {
    component = shallow(<CustomInput {...propsMock} />)
    instance = component.instance() as CustomInput
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ value: 'value' })
    expect(component.exists()).toEqual(true)
  })

  it('calls the right method on change event', () => {
    jest.spyOn(instance, 'onChange').mockImplementation(jest.fn())
    instance.forceUpdate()
    component.find('input').simulate('change')
    expect(instance.onChange).toHaveBeenCalledTimes(1)
  })

  it('calls the right method on submit event', () => {
    jest.spyOn(instance, 'onSubmit').mockImplementation(jest.fn())
    instance.forceUpdate()
    component.find('form').simulate('submit')
    expect(instance.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('changes state value of input when triggering change event', () => {
    const newValue = 'newValue'
    component.find('input').simulate('change', { currentTarget: { value: newValue } })
    expect(instance.state.value).toEqual(newValue)
  })

  it('doesnt call props function when triggering submit event when if-statement is falsy', () => {
    component.setProps({ id: undefined })
    component.find('form').simulate('submit', { preventDefault: jest.fn() })
    expect(propsMock.updateValue).toBeCalledTimes(0)
  })

  it('calls props function when triggering submit event', () => {
    component.find('form').simulate('submit', { preventDefault: jest.fn() })
    expect(propsMock.updateValue).toBeCalledTimes(1)
  })
})