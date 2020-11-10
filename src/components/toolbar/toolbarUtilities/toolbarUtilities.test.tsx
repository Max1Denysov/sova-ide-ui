import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarUtilities, mapStateToProps } from './toolbarUtilities'
import { Map, fromJS } from 'immutable'

describe('ToolbarUtilities tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    toolbarUtility: '',
  }
  const stateMock = {
    toolbar: Map(fromJS(propsMock))
  }

  beforeEach(() => {
    component = shallow(<ToolbarUtilities  {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ toolbarUtility: 'replace' })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})