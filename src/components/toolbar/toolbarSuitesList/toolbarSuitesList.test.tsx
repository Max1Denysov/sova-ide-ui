import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarSuitesList, mapStateToProps } from './toolbarSuitesList'
import { Map } from 'immutable'

describe('ToolbarSuitesList tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    items: [
      {
        id: 'id',
        profile_id: 'profile_id',
        stat: { templates: 10 },
        is_enabled: true,
        title: 'title',
        updated: 1,
      }
    ],
  }
  const reduxPropsMock = {
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
    templatesPinned: Map(),
    openedTabs: Map(),
  }
  const stateMock = {
    profiles: Map({
      selectedProfile: reduxPropsMock.selectedProfile
    }),
    toolbar: Map({
      templatesPinned: reduxPropsMock.templatesPinned,
    }),
    editors: Map({
      openedTabs: reduxPropsMock.openedTabs,
    }),
  }

  beforeEach(() => {
    component = shallow(<ToolbarSuitesList {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})