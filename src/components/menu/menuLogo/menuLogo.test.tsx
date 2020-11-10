import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { MenuLogo, mapStateToProps } from './menuLogo'
import { Map, fromJS } from 'immutable'
import { toolbarIsHidden, showToolbarUtility } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('MenuLogo tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    isHidden: false,
    toolbarUtility: '',
  }
  const stateMock = {
    toolbar: Map(fromJS({
      toolbarIsHidden: propsMock.isHidden,
      toolbarUtility: propsMock.toolbarUtility,
    }))
  }

  beforeEach(() => {
    component = shallow(<MenuLogo {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ isHidden: true })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ toolbarUtility: 'replace' })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the right method on click', () => {
    component.find('.menu-logo-link').simulate('click')
    expect(toolbarIsHidden).toHaveBeenCalledTimes(1)
  })

  it('calls the right method on click', () => {
    component.setProps({ toolbarUtility: 'replace' })
    component.find('.menu-logo-link').simulate('click')
    expect(showToolbarUtility).toHaveBeenCalledTimes(1)
  })
})