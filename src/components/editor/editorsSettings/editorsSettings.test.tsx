import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { EditorsSettings } from './editorsSettings'
import { setPinnedTemplates } from '../../../store/dispatcher'
import apolloClient from '../../../graphql/apolloClient'
import { Map } from 'immutable'
import {
  faAlignLeft,
  faArrowRight,
  faThumbtack,
  faExpandArrowsAlt,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faAlignLeft, faArrowRight, faThumbtack, faExpandArrowsAlt, faAngleUp, faAngleDown)

jest.mock('../../../store/dispatcher')

describe('EditorsSettings tests ', () => {
  let component: ShallowWrapper
  let instance: EditorsSettings
  const propsMock = {
    client: apolloClient,
    selectedProfile: {
      id: 'profileId',
      name: 'name',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: true,
        dict_write: true,
      },
    },
    suiteId: 'suiteId',
    template: {
      id: 'templateId',
      position: 1,
      content: 'content',
      created: 1,
      updated: 2,
      is_enabled: true,
      profile_id: 'string',
      suite_id: 'string',
      suite_title: 'string',
      meta: {
        title: 'title',
        description: 'description',
        last_user: null,
      },
      stats: {
        last_used: 'last_used',
        used_7d: 0,
        used_30d: 1,
      },
    },
    showFullscreen: false,
    isPinned: true,
    isOpened: true,
    showDescription: false,
    positionSortingEnabled: true,
    sortingDirectionIsAsc: true,
    handleOpen: jest.fn(),
    toggleDescription: jest.fn(),
    position: {
      isFirst: false,
      isLast: false,
    },
    siblings: {
      prev: undefined,
      next: undefined,
    },
    currentUser: Map(),
    selectedAccount: Map(),
    activeSearchResult: Map(),
  }

  beforeEach(() => {
    component = shallow(<EditorsSettings {...propsMock} />)
    instance = component.instance() as EditorsSettings
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('test props ', () => {
    const props = {
      isPinned: false,
      position: {
        isFirst: true,
        isLast: true,
      },
    }
    const wrapper = mount(<EditorsSettings {...propsMock} {...props} />)
    expect(wrapper.exists()).toEqual(true)
  })

  /* it('calls the right methods on btn click', () => {
    component.setProps({ editorHeight: 250 })
    component.find('.editorHeader-btn.btn-height').simulate('click')
    expect(propsMock.setCompact).toHaveBeenCalledTimes(1)
  }) */

  it('calls the right methods on btn click', () => {
    component.find('.editorHeader-btn.btn-desc').simulate('click')
    expect(propsMock.toggleDescription).toHaveBeenCalledTimes(1)

    jest.spyOn(instance, 'handlePin')
    instance.forceUpdate()
    component.setProps({ isOpened: false })
    component.find('.editorHeader-btn.btn-pin').simulate('click')
    expect(instance.handlePin).toHaveBeenCalledTimes(1)
    expect(setPinnedTemplates).toHaveBeenCalledTimes(1)
  })

  it('calls the right methods on btn click', () => {
    jest.spyOn(instance, 'expandFullscreen')
    instance.forceUpdate()
    const funcMock = jest.fn()
    const btn = component.find('.editorHeader-btn.btn-full')

    btn.simulate('click', {
      currentTarget: {
        closest: () => ({ requestFullscreen: funcMock }),
      },
    })
    expect(instance.expandFullscreen).toHaveBeenCalledTimes(1)
    expect(funcMock).toHaveBeenCalledTimes(1)

    btn.simulate('click', {
      currentTarget: {
        closest: () => ({ webkitRequestFullscreen: funcMock }),
      },
    })
    expect(funcMock).toHaveBeenCalledTimes(2)

    btn.simulate('click', {
      currentTarget: {
        closest: () => ({ mozRequestFullScreen: funcMock }),
      },
    })
    expect(funcMock).toHaveBeenCalledTimes(3)

    btn.simulate('click', {
      currentTarget: {
        closest: () => ({ msRequestFullscreen: funcMock }),
      },
    })
    expect(funcMock).toHaveBeenCalledTimes(4)
  })

  it('calls the right method on props change', () => {
    component.setProps({
      showFullscreen: true,
      isOpened: false,
    })
    expect(propsMock.handleOpen).toHaveBeenCalledTimes(1)

    jest.spyOn(instance, 'exitFullscreen').mockImplementation(jest.fn())
    component.find('.editorHeader-btn.btn-full').simulate('click')
    expect(instance.exitFullscreen).toHaveBeenCalledTimes(1)
  })
})
