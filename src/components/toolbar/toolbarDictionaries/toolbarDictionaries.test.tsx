import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarDictionaries, mapStateToProps } from './toolbarDictionaries'
import { Map, fromJS } from 'immutable'

describe('ToolbarDictionaries tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    displayHeader: true,
  }
  const reduxPropsMock = {
    rehydrated: true,
    dictionariesSorting: Map(),
    selectedProfileId: 'selectedProfileId',
    allDictsLoaded: false,
  }
  const stateMock = {
    _persist: {
      rehydrated: reduxPropsMock.rehydrated,
    },
    toolbar: Map({
      dictionariesSorting: reduxPropsMock.dictionariesSorting,
      allDictsLoaded: reduxPropsMock.allDictsLoaded,
    }),
    profiles: Map({
      selectedProfile: {
        id: reduxPropsMock.selectedProfileId,
      }
    })
  }

  beforeEach(() => {
    component = shallow(<ToolbarDictionaries {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})