import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarDictionariesList, mapStateToProps } from './toolbarDictionariesList'
import { Map, Set, List, fromJS } from 'immutable'

describe('ToolbarDictionariesList tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    profile_id: '',
    showHeader: true,
    data: [],
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
    rehydrated: true,
    checkAllDictionaries: false,
    dictionariesSorting: Map({
      all: 'all',
    }),
    selectedDictionaries: Set(),
    allDictsLoaded: true,
    isTemplatesPage: true,
    dictionariesCategory: 'all',
    dictCurrentSortCategory: 'all',
    searchValues: List(['value1', 'value2']),
  }
  const stateMock = {
    _persist: {
      rehydrated: reduxPropsMock.rehydrated
    },
    profiles: Map({
      selectedProfile: reduxPropsMock.selectedProfile
    }),
    toolbar: Map({
      checkAllDictionaries: Map({
        all: reduxPropsMock.checkAllDictionaries,
        private: reduxPropsMock.checkAllDictionaries,
      }),
      dictionariesSorting: reduxPropsMock.dictionariesSorting,
      searchValues: List(reduxPropsMock.searchValues),
      allDictsLoaded: reduxPropsMock.allDictsLoaded,
    }),
    editors: Map(fromJS({
      selectedDictionaries: reduxPropsMock.selectedDictionaries
    })),
    menu: Map({
      searchValues: {
        dictionaries: reduxPropsMock.searchValues,
      }
    }),
    router: {
      location: {
        pathname: '/'
      }
    }
  }

  beforeEach(() => {
    component = shallow(<ToolbarDictionariesList {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any, ownPropsMock)).toEqual(reduxPropsMock)
  })
})