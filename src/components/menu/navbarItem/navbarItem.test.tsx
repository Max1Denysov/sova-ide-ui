import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { NavbarItem } from './navbarItem'
import OutBoundClick from '../../outboundClick/outBoundClick'

describe('NavbarItem tests', () => {
  let component: ShallowWrapper
  let instance: NavbarItem
  const propsMock = {
    subNav: [[{
      title: 'TITLE',
      path: '/path/',
      action: 'action'
    }]],
    title: 'title',
    clicked: false,
    activeItem: 2,
    setActiveItem: jest.fn(),
    handleClick: jest.fn(),
    id: 1,
  }

  beforeEach(() => {
    component = shallow(<NavbarItem {...propsMock} />)
    instance = component.instance() as NavbarItem
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls funcs from props on click', () => {
    component.find('.navbar-link').first().simulate('click')
    expect(propsMock.handleClick).toHaveBeenCalledTimes(1)
    expect(propsMock.setActiveItem).toHaveBeenCalledTimes(1)
  })

  it('calls the right funcs from props on click', () => {
    component.setProps({ clicked: true })
    component.find('.navbar-item').simulate('mouseenter')
    expect(propsMock.setActiveItem).toHaveBeenCalledTimes(2)
  })

  it('calls the right funcs on outbound click', () => {
    jest.spyOn(instance, 'outBoundClick')
    component.setState({ isDropDown: true })
    component.find(OutBoundClick).props().onClick()
    expect(instance.outBoundClick).toHaveBeenCalledTimes(1)

    component.setProps({ clicked: true })
    component.find(OutBoundClick).props().onClick()
    expect(instance.outBoundClick).toHaveBeenCalledTimes(2)
    expect(propsMock.handleClick).toHaveBeenCalledTimes(2)
  })

  it('calls the right funcs on props change', () => {
    jest.spyOn(instance, 'setDropDown')
    component.setProps({ activeItem: 1 })
    expect(instance.setDropDown).toHaveBeenCalledTimes(1)
    expect(instance.state.isDropDown).toEqual(true)

    component.setProps({ clicked: true })
    expect(instance.setDropDown).toHaveBeenCalledTimes(2)
  })
})