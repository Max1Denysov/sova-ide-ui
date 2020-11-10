import * as types from '../../actions/actionTypes'
import editorsReducer from '../editorsReducer'
import { Map, Set, fromJS } from 'immutable'

describe('EditorsReducer tests', () => {
  it('should return the updated state', () => {
    const dateMock = Date.now()
    const initialState = Map(
      fromJS({
        openedTabs: {
          profileId1: {
            suiteId1: {
              id: 'suiteId1',
              opened: dateMock,
              title: 'title1',
            },
          },
        },
      })
    )
    const action1 = {
      type: types.OPENED_TABS,
      profileId: 'profileId2',
      id: 'suiteId2',
      opened: dateMock,
      title: 'title2',
    }
    const expectedState1 = Map(
      fromJS({
        openedTabs: {
          profileId1: {
            suiteId1: {
              id: 'suiteId1',
              opened: dateMock,
              title: 'title1',
            },
          },
          [action1.profileId]: {
            [action1.id]: {
              id: action1.id,
              opened: dateMock,
              title: action1.title,
            },
          },
        },
      })
    )
    const action2 = {
      type: types.OPENED_TABS,
      profileId: 'profileId1',
      id: 'suiteId2',
      opened: dateMock,
      title: 'title2',
    }
    const expectedState2 = Map(
      fromJS({
        openedTabs: {
          profileId1: {
            suiteId1: {
              id: 'suiteId1',
              opened: dateMock,
              title: 'title1',
            },
            [action2.id]: {
              id: action2.id,
              opened: dateMock,
              title: action2.title,
            },
          },
        },
      })
    )
    const action3 = {
      type: types.OPENED_TABS,
      profileId: 'profileId2',
      id: 'suiteId2',
      opened: dateMock,
    }
    const expectedState3 = Map(
      fromJS({
        openedTabs: {
          profileId1: {
            suiteId1: {
              id: 'suiteId1',
              opened: dateMock,
              title: 'title1',
            },
          },
          [action3.profileId]: {
            [action3.id]: {
              id: action3.id,
              opened: dateMock,
              title: '',
            },
          },
        },
      })
    )
    const action4 = {
      type: types.OPENED_TABS,
      profileId: 'profileId1',
      id: 'suiteId2',
      opened: dateMock,
    }
    const expectedState4 = Map(
      fromJS({
        openedTabs: {
          profileId1: {
            suiteId1: {
              id: 'suiteId1',
              opened: dateMock,
              title: 'title1',
            },
            [action4.id]: {
              id: action4.id,
              opened: dateMock,
              title: '',
            },
          },
        },
      })
    )
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
    expect(editorsReducer(initialState, action3)).toEqual(expectedState3)
    expect(editorsReducer(initialState, action4)).toEqual(expectedState4)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        openedTabs: {
          profileId: {
            suiteId: {
              id: 'suiteId',
              title: 'suiteTitle',
            },
          },
        },
      })
    )
    const action1 = {
      type: types.CLOSE_TAB,
      profileId: 'profileId',
      id: 'suiteId',
    }
    const expectedState1 = Map(
      fromJS({
        openedTabs: {
          profileId: {},
        },
      })
    )
    const action2 = {
      type: types.CLOSE_TAB,
      profileId: 'profileId',
      id: null,
    }
    const expectedState2 = Map(
      fromJS({
        openedTabs: {
          profileId: {},
        },
      })
    )
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      activeTab: null,
    })
    const action = {
      type: types.ACTIVE_TAB,
      payload: 'suiteId',
    }
    const expectedState = Map({
      activeTab: action.payload,
    })
    expect(editorsReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      openedDictionaries: Map(),
    })
    const action = {
      type: types.OPENED_DICTIONARIES,
      id: 'dictId',
      opened: 0,
    }
    const expectedState = Map({
      openedDictionaries: Map({ [action.id]: Map({ id: action.id, opened: action.opened }) }),
    })
    expect(editorsReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      openedDictionaries: Map({ dictId1: 'dictId1', dictId2: 'dictId2', dictId3: 'dictId3' }),
    })
    const action1 = {
      type: types.CLOSE_DICTIONARY,
      id: 'dictId2',
    }
    const expectedState1 = Map({
      openedDictionaries: Map({ dictId1: 'dictId1', dictId3: 'dictId3' }),
    })
    const action2 = {
      type: types.CLOSE_DICTIONARY,
      id: Set(['dictId1', 'dictId2']),
    }
    const expectedState2 = Map({
      openedDictionaries: Map({ dictId3: 'dictId3' }),
    })
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      selectedDictionaries: Map({ dictId1: 'dictId1', dictId2: 'dictId2' }),
    })
    const action1 = {
      type: types.SELECT_UNSELECT_DICTIONARIES,
      payload: Map({ dictId3: 'dictId3' }),
    }
    const expectedState1 = Map({
      selectedDictionaries: Map({ dictId1: 'dictId1', dictId2: 'dictId2', dictId3: 'dictId3' }),
    })
    const action2 = {
      type: types.SELECT_UNSELECT_DICTIONARIES,
      payload: Map({ dictId1: 'dictId1' }),
    }
    const expectedState2 = Map({
      selectedDictionaries: Map({ dictId1: 'dictId1', dictId2: 'dictId2' }),
    })
    const action3 = {
      type: types.SELECT_UNSELECT_DICTIONARIES,
      payload: null,
    }
    const expectedState3 = Map({
      selectedDictionaries: Map(),
    })
    const action4 = {
      type: types.SELECT_UNSELECT_DICTIONARIES,
      payload: Map({ dictId3: 'dictId3', dictId4: 'dictId4' }),
    }
    const expectedState4 = Map({
      selectedDictionaries: Map({ dictId1: 'dictId1', dictId2: 'dictId2', dictId3: 'dictId3', dictId4: 'dictId4' }),
    })
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
    expect(editorsReducer(initialState, action3)).toEqual(expectedState3)
    expect(editorsReducer(initialState, action4)).toEqual(expectedState4)
  })

  it('should return the updated state3', () => {
    const initialState = Map({
      selectedSuites: Map({ suite1: 'suite1', suite2: 'suite2' }),
    })
    const action1 = {
      type: types.SELECT_UNSELECT_SUITES,
      payload: Map({ suite3: 'suite3', suite4: 'suite4' }),
    }
    const expectedState1 = Map({
      selectedSuites: Map({ suite1: 'suite1', suite2: 'suite2', suite3: 'suite3', suite4: 'suite4' }),
    })
    const action2 = {
      type: types.SELECT_UNSELECT_SUITES,
      payload: Map({ suite1: 'suite1' }),
    }
    const expectedState2 = Map({
      selectedSuites: Map({ suite1: 'suite1', suite2: 'suite2' }),
    })
    const action3 = {
      type: types.SELECT_UNSELECT_SUITES,
      payload: Map({ suite3: 'suite3' }),
    }
    const expectedState3 = Map({
      selectedSuites: Map({ suite1: 'suite1', suite2: 'suite2', suite3: 'suite3' }),
    })
    const action4 = {
      type: types.SELECT_UNSELECT_SUITES,
      payload: null,
    }
    const expectedState4 = Map({
      selectedSuites: Map(),
    })
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
    expect(editorsReducer(initialState, action3)).toEqual(expectedState3)
    expect(editorsReducer(initialState, action4)).toEqual(expectedState4)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        editorsFilter: {
          showOk: true,
          showAttention: true,
          showWarning: true,
        },
      })
    )
    const action1 = {
      type: types.EDITORS_FILTER,
      payload: 'showOk',
    }
    const expectedState1 = Map(
      fromJS({
        editorsFilter: {
          showOk: false,
          showAttention: true,
          showWarning: true,
        },
      })
    )
    const action2 = {
      type: types.EDITORS_FILTER,
      payload: null,
    }
    const expectedState2 = Map(
      fromJS({
        editorsFilter: {
          showOk: true,
          showAttention: true,
          showWarning: true,
        },
      })
    )
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        scrollTo: null,
      })
    )
    const action = {
      type: types.SCROLL_TO,
      payload: 'idToScroll',
    }
    const expectedState = Map(
      fromJS({
        scrollTo: action.payload,
      })
    )
    expect(editorsReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState1 = Map(
      fromJS({
        fullscreenId: null,
      })
    )
    const action1 = {
      type: types.TOGGLE_FULLSCREEN,
      payload: 'editorId',
    }
    const expectedState1 = Map(
      fromJS({
        fullscreenId: action1.payload,
      })
    )
    const initialState2 = Map(
      fromJS({
        fullscreenId: 'editorId',
      })
    )
    const action2 = {
      type: types.TOGGLE_FULLSCREEN,
      payload: 'editorId',
    }
    const expectedState2 = Map(
      fromJS({
        fullscreenId: null,
      })
    )
    expect(editorsReducer(initialState1, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState2, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        editorsSorting: {
          type: 'created',
          isAsc: false,
        },
      })
    )
    const action1 = {
      type: types.SET_EDITORS_SORTING,
      sort: 'updated',
    }
    const expectedState1 = Map(
      fromJS({
        editorsSorting: {
          type: action1.sort,
          isAsc: false,
        },
      })
    )
    const action2 = {
      type: types.SET_EDITORS_SORTING,
      sort: 'created',
    }
    const expectedState2 = Map(
      fromJS({
        editorsSorting: {
          type: action2.sort,
          isAsc: true,
        },
      })
    )
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map(
      fromJS({
        openedTabs: {
          profileId: {
            suiteId: {
              title: '',
            },
          },
        },
      })
    )
    const action1 = {
      type: types.UPDATE_TAB_TITLE,
      profileId: 'profileId',
      suiteId: 'suiteId',
      title: 'newTitle',
    }
    const expectedState1 = Map(
      fromJS({
        openedTabs: {
          profileId: {
            suiteId: {
              title: action1.title,
            },
          },
        },
      })
    )
    const action2 = {
      type: types.UPDATE_TAB_TITLE,
      profileId: 'profileId1',
      suiteId: 'suiteId1',
      title: 'newTitle',
    }
    const expectedState2 = Map(
      fromJS({
        openedTabs: {
          profileId: {
            suiteId: {
              title: '',
            },
          },
        },
      })
    )
    expect(editorsReducer(initialState, action1)).toEqual(expectedState1)
    expect(editorsReducer(initialState, action2)).toEqual(expectedState2)
  })
})
