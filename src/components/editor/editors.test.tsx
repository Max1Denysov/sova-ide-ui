import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { Editors, mapStateToProps } from './editors'
import { Map, List, fromJS } from 'immutable'
import { toggleFullscreen, displayDictionaryEditor } from '../../store/dispatcher'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import { ApolloProvider } from 'react-apollo'
import apolloClient from '../../graphql/apolloClient'
import { faFilter, faCaretDown, faCompress } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faFilter, faCaretDown, faCompress)

describe('Editors tests', () => {
  let component: ShallowWrapper
  let instance: Editors
  const propsMock = {
    rehydrated: true,
    openedTabs: Map(),
    activeTab: '',
    editorsFilter: Map(),
    editorsSorting: Map(),
    currentUser: Map(),
    animationEnabled: true,
    editorsOpened: true,
    fullscreenId: null,
    selectedProfile: {
      id: '9659a69b-8f26-4d82-97e7-a98cb6007ed4',
      name: 'name',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: true,
        dict_write: true,
      },
    },
    displayDictionaryEditor: Map({
      id: 'dictId',
      status: true,
    }),
    dlReadOnly: false,
    searchValues: List(['']),
    showLinesCount: true,
    selectedAccount: Map(),
  }

  const stateMock = {
    _persist: {
      rehydrated: propsMock.rehydrated,
    },
    editors: Map({
      openedTabs: Map(propsMock.openedTabs),
      activeTab: propsMock.activeTab,
      editorsFilter: propsMock.editorsFilter,
      fullscreenId: propsMock.fullscreenId,
      displayDictionaryEditor: propsMock.displayDictionaryEditor,
      editorsSorting: propsMock.editorsSorting,
    }),
    auth: Map({
      user: propsMock.currentUser,
    }),
    profiles: Map({
      selectedProfile: propsMock.selectedProfile,
      selectedAccount: propsMock.selectedAccount,
    }),
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                animationEnabled: {
                  value: propsMock.animationEnabled,
                },
                editorsOpened: {
                  value: propsMock.editorsOpened,
                },
                showLinesCount: {
                  value: propsMock.showLinesCount,
                },
              },
            },
          },
        },
        editorsOpened: propsMock.editorsOpened,
      })
    ),
    menu: Map(
      fromJS({
        searchValues: {
          editors: propsMock.searchValues,
        },
      })
    ),
  }
  function setupIntersectionObserverMock({ observe = () => null, unobserve = () => null } = {}) {
    class IntersectionObserver {
      observe = observe
      unobserve = unobserve
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserver,
    })
    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserver,
    })
  }

  beforeEach(() => {
    setupIntersectionObserverMock()
    component = shallow(<Editors {...propsMock} />)
    instance = component.instance() as Editors
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const propTest = {
      rehydrated: true,
      openedTabs: Map({
        '9659a69b-8f26-4d82-97e7-a98cb6007ed4': {
          '9cefd814-6c10-4742-8c2d-00443a4d3314': {
            id: '9cefd814-6c10-4742-8c2d-00443a4d3314',
            title: 'test_2',
            opened: 1597830841131,
          },
        },
      }),
      activeTab: 'test',
      editorsFilter: Map({
        showOk: true,
        showAttention: true,
        showWarning: true,
      }),
      editorsSorting: Map(),
      currentUser: Map(
        fromJS({
          id: 'id',
          name: 'name',
          username: 'username',
          role: {
            id: 2,
            name: 'User',
          },
        })
      ),
      animationEnabled: true,
      editorsOpened: true,
      fullscreenId: null,
      selectedProfile: {
        id: '9659a69b-8f26-4d82-97e7-a98cb6007ed4',
        name: 'name',
        is_enabled: true,
        permissions: {
          dl_read: true,
          dl_write: true,
          dict_read: true,
          dict_write: true,
        },
      },
      displayDictionaryEditor: Map({
        id: '9659a69b-8f26-4d82-97e7-a98cb6007ed4',
        status: true,
      }),
      dlReadOnly: false,
      searchValues: List(['']),
      showLinesCount: true,
      selectedAccount: Map({
        id: 25,
        name: 'test1234567',
        account_id: 'f8259f2a-2316-45dd-b9bc-97df27b8a5cc',
      }),
      activeSearchResult: Map(
        fromJS({
          result: '9659a69b-8f26-4d82-97e7-a98cb6007ed4',
          vars: {
            text: 'text',
          },
          profileName: 'name',
        })
      ),
    }
    const wrapper = mount(
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <Editors {...propTest} />
        </Provider>
      </ApolloProvider>
    )
    //console.log(wrapper.debug())
    expect(wrapper.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      openedTabs: Map(
        fromJS({
          profileId: {
            id: {
              id: 'id',
              title: 'title',
            },
          },
        })
      ),
      displayDictionaryEditor: Map({
        id: 'dictId',
        status: false,
      }),
      activeSearchResult: Map({
        result: 'test',
      }),
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the right method on prop update', () => {
    jest.spyOn(instance, 'refetchQuery').mockImplementation(jest.fn())
    component.setProps({ activeTab: 'activeTab' })
    expect(instance.refetchQuery).toHaveBeenCalledTimes(1)
  })

  /* it('calls the right method on prop update', () => {
    jest.spyOn(instance, 'fullScreenHandler').mockImplementation(jest.fn())
    component.simulate('fullscreenchange')
    expect(instance.fullScreenHandler).toHaveBeenCalledTimes(1)
  }) */
})
