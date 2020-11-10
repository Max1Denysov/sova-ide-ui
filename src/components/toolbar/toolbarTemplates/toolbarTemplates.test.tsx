import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarTemplates from './toolbarTemplates'
import { Map, fromJS } from 'immutable'
import { scrollToTemplate, setActiveTab } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('ToolbarTemplates tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    isCollapsed: true,
    suiteId: 'suiteId',
    templatesPinned: Map(fromJS({
      id1: {
        id: 'id1',
        title: 'title1',
        is_enabled: true,
      }
    })),
    isActiveTab: false,
    animationEnabled: true
  }

  beforeEach(() => {
    component = shallow(<ToolbarTemplates {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      templatesPinned: Map(fromJS({
        id1: {
          id: 'id1',
          title: '',
          is_enabled: false,
        }
      })),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({ isCollapsed: false })
    expect(component.exists()).toEqual(true)
  })

  it('calls the right methods on click', () => {
    component.find('.toolbar-file-template-goto').simulate('click')
    expect(scrollToTemplate).toHaveBeenCalledTimes(1)
    expect(setActiveTab).toHaveBeenCalledTimes(1)

    component.setProps({ isActiveTab: true })
    component.find('.toolbar-file-template-goto').simulate('click')
    expect(scrollToTemplate).toHaveBeenCalledTimes(2)
  })
})