import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarSuites, mapStateToProps } from './toolbarSuites'
import { Map, Set, List } from 'immutable'

describe('ToolbarSuites tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    showHeader: true
  }
  const reduxPropsMock = {
    rehydrated: true,
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
    checkAllSuites: false,
    suitesSorting: Map(),
    selectedSuites: Set(),
    searchValues: List(['value1', 'value2']),
    dlReadOnly: false,
    allSuitesLoaded: Map(),
  }
  const stateMock = {
    _persist: {
      rehydrated: reduxPropsMock.rehydrated
    },
    profiles: Map({
      selectedProfile: reduxPropsMock.selectedProfile
    }),
    toolbar: Map({
      checkAllSuites: reduxPropsMock.checkAllSuites,
      suitesSorting: reduxPropsMock.suitesSorting,
      allSuitesLoaded: reduxPropsMock.allSuitesLoaded,
    }),
    editors: Map({
      selectedSuites: reduxPropsMock.selectedSuites,
    }),
    menu: Map({
      searchValues: {
        suites: reduxPropsMock.searchValues,
      }
    })
  }

  beforeEach(() => {
    component = shallow(<ToolbarSuites {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})