import * as types from '../../actions/actionTypes'
import toolbarReducer from '../toolbarReducer'
import { Map, List, fromJS } from 'immutable'

describe('ToolbarReducer tests', () => {
  it('should return the updated state', () => {
    const initialState = Map({
      toolbarIsHidden: false,
    })
    const action = {
      type: types.TOOLBAR_IS_HIDDEN,
      status: true,
    }
    const expectedState = Map({
      toolbarIsHidden: action.status,
    })
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      templatesPinned: {
        suiteId1: {
          id1: {
            id: 'id1',
            position: 1,
            content: 'content',
            updated: 'updated',
            is_enabled: true,
            meta: {
              title: 'title',
              description: 'description',
              last_user: null
            },
            stats: {
              last_used: 'last_used',
              used_7d: 0,
              used_30d: 1,
            }
          },
        },
      },
    }))
    const action1 = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId1',
      id: null,
      template: null,
    }
    const expectedState1 = Map(fromJS({
      templatesPinned: {},
    }))
    const action2 = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId1',
      id: 'id2',
      template: {
        id: 'id2',
        position: 2,
        content: 'content',
        updated: 'updated',
        is_enabled: true,
        meta: {
          title: 'title',
          description: 'description',
          last_user: null
        },
        stats: {
          last_used: 'last_used',
          used_7d: 0,
          used_30d: 1,
        }
      },
    }
    const expectedState2 = Map(fromJS({
      templatesPinned: {
        suiteId1: {
          id1: {
            id: 'id1',
            position: 1,
            content: 'content',
            updated: 'updated',
            is_enabled: true,
            meta: {
              title: 'title',
              description: 'description',
              last_user: null
            },
            stats: {
              last_used: 'last_used',
              used_7d: 0,
              used_30d: 1,
            }
          },
          [action2.id]: action2.template,
        },
      },
    }))
    const action3 = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId2',
      id: 'id2',
      template: {
        id: 'id2',
        position: 2,
        content: 'content',
        updated: 'updated',
        is_enabled: true,
        meta: {
          title: 'title',
          description: 'description',
          last_user: null
        },
        stats: {
          last_used: 'last_used',
          used_7d: 0,
          used_30d: 1,
        },
      },
    }
    const expectedState3 = Map(fromJS({
      templatesPinned: {
        suiteId1: {
          id1: {
            id: 'id1',
            position: 1,
            content: 'content',
            updated: 'updated',
            is_enabled: true,
            meta: {
              title: 'title',
              description: 'description',
              last_user: null
            },
            stats: {
              last_used: 'last_used',
              used_7d: 0,
              used_30d: 1,
            }
          },
        },
        [action3.suiteId]: {
          [action3.id]: action3.template,
        },
      },
    }))
    const action4 = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId1',
      id: 'id1',
      template: {
        id: 'id1',
        position: 1,
        content: 'content',
        updated: 'updated',
        is_enabled: true,
        meta: {
          title: 'NEW title1',
          description: 'description',
          last_user: null
        },
        stats: {
          last_used: 'last_used',
          used_7d: 0,
          used_30d: 1,
        }
      },
    }
    const expectedState4 = Map(fromJS({
      templatesPinned: {
        suiteId1: {
          id1: action4.template
        },
      },
    }))
    const action5 = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId1',
      id: 'id1',
      template: null,
    }
    const expectedState5 = Map(fromJS({
      templatesPinned: {
        suiteId1: {}
      },
    }))
    expect(toolbarReducer(initialState, action1)).toEqual(expectedState1)
    expect(toolbarReducer(initialState, action2)).toEqual(expectedState2)
    expect(toolbarReducer(initialState, action3)).toEqual(expectedState3)
    expect(toolbarReducer(initialState, action4)).toEqual(expectedState4)
    expect(toolbarReducer(initialState, action5)).toEqual(expectedState5)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      checkAllSuites: false,
    })
    const action = {
      type: types.CHECK_ALL_SUITES,
      value: true,
    }
    const expectedState = Map({
      checkAllSuites: action.value,
    })
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      suitesSorting: {
        type: 'title',
        isAsc: true,
      },
    }))
    const action1 = {
      type: types.SET_SUITES_SORTING,
      value: 'title',
    }
    const expectedState1 = Map(fromJS({
      suitesSorting: {
        type: 'title',
        isAsc: false,
      },
    }))
    const action2 = {
      type: types.SET_SUITES_SORTING,
      value: 'date',
    }
    const expectedState2 = Map(fromJS({
      suitesSorting: {
        type: action2.value,
        isAsc: true,
      },
    }))
    expect(toolbarReducer(initialState, action1)).toEqual(expectedState1)
    expect(toolbarReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      dictionariesSorting: {
        selected: {
          sortType: 'title',
          isAsc: true,
        },
        common: {
          sortType: 'title',
          isAsc: true,
        },
      },
    }))
    const action1 = {
      type: types.SET_DICTIONARIES_SORTING,
      sortType: 'title',
      category: 'common',
    }
    const expectedState1 = Map(fromJS({
      dictionariesSorting: {
        selected: {
          sortType: 'title',
          isAsc: true,
        },
        common: {
          sortType: 'title',
          isAsc: false,
        },
      },
    }))
    const action2 = {
      type: types.SET_DICTIONARIES_SORTING,
      sortType: 'count',
      category: 'common',
    }
    const expectedState2 = Map(fromJS({
      dictionariesSorting: {
        selected: {
          sortType: 'title',
          isAsc: true,
        },
        common: {
          sortType: 'count',
          isAsc: true,
        },
      },
    }))
    expect(toolbarReducer(initialState, action1)).toEqual(expectedState1)
    expect(toolbarReducer(initialState, action2)).toEqual(expectedState2)
  })

  it('should return the updated state', () => {
    const initialState = Map(fromJS({
      checkAllDictionaries: {
        common: false,
      },
    }))
    const action = {
      type: types.CHECK_ALL_DICTIONARIES,
      category: 'common',
    }
    const expectedState = Map(fromJS({
      checkAllDictionaries: {
        common: true
      },
    }))
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      toolbarUtility: '',
    })
    const action = {
      type: types.TOOLBAR_UTILITY,
      id: 'replace',
    }
    const expectedState = Map({
      toolbarUtility: action.id,
    })
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      allDictsLoaded: false,
    })
    const action = {
      type: types.ALL_DICTS_LOADED,
      value: true,
    }
    const expectedState = Map({
      allDictsLoaded: action.value,
    })
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })

  it('should return the updated state', () => {
    const initialState = Map({
      allSuitesLoaded: Map(),
    })
    const action = {
      type: types.ALL_SUITES_LOADED,
      profileId: 'profileId',
      value: true,
    }
    const expectedState = Map({
      allSuitesLoaded: Map({
        profileId: action.value,
      }),
    })
    expect(toolbarReducer(initialState, action)).toEqual(expectedState)
  })
})