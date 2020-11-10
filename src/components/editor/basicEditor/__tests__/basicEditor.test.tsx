import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { BasicEditor, mapStateToProps } from '../basicEditor'
import { Map, fromJS } from 'immutable'

describe('BasicEditor tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    template: {
      id: 'templateId',
      position: 0,
      content: 'string',
      created: 1,
      updated: 2,
      is_enabled: true,
      profile_id: 'string',
      suite_id: 'string',
      suite_title: 'string',
      meta: {
        title: 'title',
        description: 'string',
        last_user: {
          uuid: 'string',
          name: 'string',
          username: 'string',
          user_role: 'string',
        },
      },
      stats: {
        last_used: 'string',
        used_7d: 1,
        used_30d: 2,
      }
    },
    suiteId: 'suiteId',
    currentUser: Map(),
    animationEnabled: true,
    editorsOpened: true,
    indexNum: 1,
    active: false,
    textEditor: 'textEditor',
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
    root: null,
    position: {
      isFirst: false,
      isLast: false,
    },
    siblings: {
      prev: undefined,
      next: undefined,
    },
  }
  const reduxPropsMock = {
    scrollTo: false,
    showFullscreen: false,
    isPinned: true,
    favTemplatesExpanded: true,
    dlReadOnly: false,
    showLinesCount: true,
    editorsSorting: Map(),
    selectedAccount: Map(),
  }
  const stateMock = {
    editors: Map(
      fromJS({
        scrollTo: null,
        fullscreenId: null,
        editorsSorting: reduxPropsMock.editorsSorting,
      })
    ),
    toolbar: Map(
      fromJS({
        templatesPinned: {
          suiteId: {
            templateId: {
              id: 'templateId',
              title: 'title',
            },
          },
        },
      })
    ),
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                favTemplatesExpanded: {
                  value: reduxPropsMock.favTemplatesExpanded,
                },
                showLinesCount: {
                  value: reduxPropsMock.showLinesCount,
                },
              },
            },
          },
        },
      })
    ),
    profiles: Map({
      selectedProfile: {
        permissions: {
          dl_write: true,
        },
      },
      selectedAccount: reduxPropsMock.selectedAccount,
    }),
  }

  beforeEach(() => {
    component = shallow(<BasicEditor {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any, ownPropsMock)).toEqual(reduxPropsMock)
  })
})
