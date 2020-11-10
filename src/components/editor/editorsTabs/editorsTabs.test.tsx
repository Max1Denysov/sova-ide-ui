import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { EditorsTabs, mapStateToProps } from './editorsTabs'
import { Map, fromJS } from 'immutable'
import { scrollToTemplate, setActiveTab, closeOpenedTab } from '../../../store/dispatcher'
import apolloClient from '../../../graphql/apolloClient'

jest.mock('../../../store/dispatcher')

describe('EditorsTabs tests', () => {
  let component: ShallowWrapper
  let instance: EditorsTabs
  const dateMock = Date.now()
  const ownPropsMock = {
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
    }
  }
  const reduxPropsMock = {
    openedTabs: Map(fromJS({
      id1: {
        id: 'id1',
        opened: dateMock,
        title: 'title1',
      },
      id2: {
        id: 'id2',
        opened: dateMock,
        title: 'title2',
      },
    })),
    activeTab: 'id2',
    suitesSorting: Map()
  }
  const stateMock = {
    editors: Map(fromJS({
      openedTabs: {
        profileId: reduxPropsMock.openedTabs,
      },
      activeTab: reduxPropsMock.activeTab,
    })),
    toolbar: Map(fromJS({
      suitesSorting: reduxPropsMock.suitesSorting,
    }))
  }

  beforeEach(() => {
    component = shallow(<EditorsTabs {...ownPropsMock} {...reduxPropsMock} />)
    instance = component.instance() as EditorsTabs
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      activeTab: null,
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: undefined,
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(fromJS({
        id1: {
          id: 'id1',
          opened: dateMock,
          title: 'title',
        },
        id2: {
          id: 'id2',
          opened: dateMock,
          title: 'title',
        },
      })),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(fromJS({
        id1: {
          id: 'id1',
          opened: dateMock,
          title: 'title1',
        },
        id2: {
          id: 'id2',
          opened: dateMock + 1,
          title: 'title2',
        },
      })),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(fromJS({
        id1: {
          id: 'id1',
          opened: dateMock + 1,
          title: 'title1',
        },
        id2: {
          id: 'id2',
          opened: dateMock,
          title: 'title2',
        },
      })),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(fromJS({
        id1: {
          id: 'id1',
          opened: dateMock,
          title: 'title1',
        },
        id2: {
          id: 'id2',
          opened: null,
          title: 'title2',
        },
      })),
    })
    expect(component.exists()).toEqual(true)

    component.setProps({
      openedTabs: Map(fromJS({
        id1: {
          id: 'id2',
          opened: dateMock,
          title: 'title',
        },
        id2: {
          id: 'id1',
          opened: dateMock,
          title: 'title',
        },
      })),
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any, ownPropsMock)).toEqual(reduxPropsMock)
  })

  it('calls the right method on click on certain element', () => {
    jest.spyOn(instance, 'setActive').mockImplementation(jest.fn())
    component.find('.editorsTabs-select').first().simulate('mouseup', { button: 0 })
    expect(instance.setActive).toHaveBeenCalledTimes(1)

    jest.spyOn(instance, 'removeTab').mockImplementation(jest.fn())
    component.find('.editorsTabs-select').first().simulate('mouseup', { button: 1 })
    expect(instance.removeTab).toHaveBeenCalledTimes(1)
  })

  it('calls the right method on click on certain element', () => {
    jest.spyOn(instance, 'removeTab').mockImplementation(jest.fn())
    component.find('.editorsTabs-close').first().simulate('click')
    expect(instance.removeTab).toHaveBeenCalledTimes(1)
  })

  it('calls the dispatcher methods', () => {
    component.find('.editorsTabs-select').first().simulate('mouseup', { button: 0 })
    expect(scrollToTemplate).toHaveBeenCalledTimes(1)
    expect(setActiveTab).toHaveBeenCalledTimes(1)
  })

  it('calls the dispatcher methods', () => {
    component.find('.editorsTabs-close').first().simulate('click')
    expect(closeOpenedTab).toHaveBeenCalledTimes(1)

    component.find('.editorsTabs-close').last().simulate('click')
    expect(setActiveTab).toHaveBeenCalledTimes(2)
    expect(closeOpenedTab).toHaveBeenCalledTimes(2)

    component.setProps({
      activeTab: 'id2',
      openedTabs: Map(fromJS({
        id2: {
          id: 'id2',
          opened: dateMock,
          title: 'title2',
        }
      })),
    })
    component.find('.editorsTabs-close').first().simulate('click')
    expect(setActiveTab).toHaveBeenCalledTimes(3)
  })
})