import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarSuite, mapStateToProps } from './toolbarSuite'
import { Map, Set, fromJS } from 'immutable'
import { /*setOpenedTabs, setActiveTab,*/ selectUnselectSuites } from '../../../store/dispatcher'
import apolloClient from '../../../graphql/apolloClient'

jest.mock('../../../store/dispatcher')

describe('ToolbarSuite tests', () => {
  let component: ShallowWrapper
  let instance: ToolbarSuite
  const reduxPropsMock = {
    isActiveTab: true,
    isOpened: true,
    isChecked: false,
    templatesPinned: Map({
      id1: {
        id: 'id1',
        title: 'title1',
      },
    }),
    animationEnabled: true,
    whenOpened: 123,
    dlReadOnly: false,
  }
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
    },
    suite: {
      id: 'suiteId',
      profile_id: 'profile_id',
      stat: {
        templates: 0,
      },
      is_enabled: true,
      title: 'title',
      updated: 2,
    },
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                animationEnabled: {
                  value: reduxPropsMock.animationEnabled,
                },
              },
            },
          },
        },
      })
    ),
  }

  const stateMock = {
    editors: Map(
      fromJS({
        activeTab: ownPropsMock.suite.id,
        openedTabs: {
          profileId: {
            suiteId: {
              opened: reduxPropsMock.whenOpened,
            },
          },
        },
        selectedSuites: Set(),
      })
    ),
    toolbar: Map(
      fromJS({
        templatesPinned: {
          suiteId: reduxPropsMock.templatesPinned,
        },
      })
    ),
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                animationEnabled: {
                  value: reduxPropsMock.animationEnabled,
                },
              },
            },
          },
        },
      })
    ),
    profiles: Map({
      selectedProfile: ownPropsMock.selectedProfile,
    }),
  }

  beforeEach(() => {
    component = shallow(<ToolbarSuite {...ownPropsMock} {...reduxPropsMock} />)
    instance = component.instance() as ToolbarSuite
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const alterComp = shallow(<ToolbarSuite {...ownPropsMock} {...reduxPropsMock} templatesPinned={Map()} />)
    expect(alterComp.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ isChecked: true })
    expect(component.exists()).toEqual(true)

    component.setProps({
      suite: {
        id: 'suiteId',
        profile_id: 'profile_id',
        stat: {
          templates: 0,
        },
        is_enabled: true,
        title: 'title',
        updated: null,
      },
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any, ownPropsMock)).toEqual(reduxPropsMock)
  })

  it('calls the right methods on click', () => {
    jest.spyOn(instance, 'checkSuite')
    instance.forceUpdate()
    component.find('.toolbar-file-select').simulate('click')
    expect(instance.checkSuite).toHaveBeenCalledTimes(1)
    expect(selectUnselectSuites).toHaveBeenCalledTimes(1)
  })

  /*it('calls the right methods on click', () => {
    jest.spyOn(instance, 'toggleSuite')
    component.setProps({ isOpened: false })
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })
    expect(instance.toggleSuite).toHaveBeenCalledTimes(1)
    expect(setOpenedTabs).toHaveBeenCalledTimes(1)
    expect(instance.state.isCollapsed).toEqual(true)

    component.setProps({ isActiveTab: false })
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })
    expect(setActiveTab).toHaveBeenCalledTimes(1)

    component.setProps({ isOpened: true })
    component.setState({ isCollapsed: true })
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })

    component.setProps({ alwaysCollapsed: true })
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })
  })*/

  it('calls the right method and updates the state properly', () => {
    jest.spyOn(instance, 'checkPinned')
    component.setState({ isCollapsed: true })
    component.setProps({
      isOpened: false,
      templatesPinned: Map({
        id1: {
          id: 'id1',
          title: 'NEW title1',
        },
      }),
    })
    expect(instance.checkPinned).toHaveBeenCalledTimes(1)

    component.setProps({
      isOpened: false,
      templatesPinned: Map({
        id1: {
          id: 'id1',
          title: 'title1',
        },
        id2: {
          id: 'id2',
          title: 'title2',
        },
      }),
    })
    expect(instance.checkPinned).toHaveBeenCalledTimes(2)
    expect(instance.state.showCaret).toEqual(true)
    expect(instance.state.isCollapsed).toEqual(true)

    component.setProps({
      isOpened: true,
      templatesPinned: Map(),
    })
    expect(instance.checkPinned).toHaveBeenCalledTimes(3)
    expect(instance.state.showCaret).toEqual(false)

    component.setProps({
      isOpened: false,
      templatesPinned: undefined,
    })
    expect(instance.checkPinned).toHaveBeenCalledTimes(4)
    expect(instance.state.showCaret).toEqual(false)
    expect(instance.state.isCollapsed).toEqual(false)
  })
})
