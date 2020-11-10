import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Dictionaries, mapStateToProps } from './dictionaries'
import { Map, fromJS } from 'immutable'

describe('Dictionaries tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    rehydrated: true,
    openedDictionaries: Map(),
    currentUser: Map(),
    selectedProfileId: 'selectedProfileId',
    openedTabs: Map(),
    showLinesCount: true,
    selectedAccount: Map(),
  }
  const stateMock = {
    _persist: {
      rehydrated: propsMock.rehydrated,
    },
    editors: Map(
      fromJS({
        openedDictionaries: propsMock.openedDictionaries,
        openedTabs: propsMock.openedTabs,
      })
    ),
    auth: Map({
      user: propsMock.currentUser,
    }),
    profiles: Map({
      selectedProfile: {
        id: propsMock.selectedProfileId,
      },
      selectedAccount: propsMock.selectedAccount,
    }),
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                showLinesCount: {
                  value: propsMock.showLinesCount,
                },
              },
            },
            editors: {
              clientSettings: {
                showLinesCount: {
                  value: propsMock.showLinesCount,
                },
              },
            },
          },
        },
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<Dictionaries {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  /* it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ openedDictionaries: Map(['dict1', 'dict2', 'dict3']) })
    expect(component.exists()).toEqual(true)
  }) */

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
