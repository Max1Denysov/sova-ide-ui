import { Map, Set, fromJS } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { RandomObject } from '../../@types/common'

const initialState = Map(
  fromJS({
    openedTabs: {},
    openedDictionaries: {},
    activeTab: null,
    editorsFilter: {
      showOk: true,
      showAttention: true,
      showWarning: true,
    },
    selectedDictionaries: Map(),
    selectedSuites: Map(),
    scrollTo: null,
    displayDictionaryEditor: { status: false, dictId: '', templateId: '' },
    fullscreenId: null,
    editorsSorting: {
      type: 'created',
      isAsc: false,
    },
    lastCompilationDate: {},
  })
)

const editorsReducer = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),

  [actionTypes.OPENED_TABS]: (
    state: Map<any, any>,
    action: { type: string; profileId: string; id: string; opened: number; title?: string }
  ) => {
    if (!state.get('openedTabs').has(action.profileId)) {
      return state.update('openedTabs', (value: Map<any, any>) =>
        value.set(
          action.profileId,
          Map().set(action.id, Map({ id: action.id, title: action.title || '', opened: action.opened }))
        )
      )
    } else {
      return state.updateIn(['openedTabs', action.profileId], (value: Map<any, any>) =>
        value.set(action.id, Map({ id: action.id, title: action.title || '', opened: action.opened }))
      )
    }
  },

  [actionTypes.CLOSE_TAB]: (state: Map<any, any>, action: { type: string; profileId: string; id: string | null }) => {
    if (action.id) {
      return state.updateIn(['openedTabs', action.profileId], (value: Map<any, any>) => value.delete(action.id))
    } else {
      return state.update('openedTabs', (value: Map<any, any>) => value.set(action.profileId, Map()))
    }
  },

  [actionTypes.ACTIVE_TAB]: (state: Map<any, any>, action: { type: string; payload: string | null }) =>
    state.update('activeTab', () => action.payload),

  [actionTypes.OPENED_DICTIONARIES]: (state: Map<any, any>, action: { type: string; id: string; opened: number }) => {
    return state.update('openedDictionaries', (value: Map<any, any>) =>
      value.set(action.id, Map({ id: action.id, opened: action.opened }))
    )
  },

  [actionTypes.CLOSE_DICTIONARY]: (state: Map<any, any>, action: { type: string; id: string | Set<string> }) => {
    if (typeof action.id === 'string') {
      return state.update('openedDictionaries', (value: Map<any, any>) => value.delete(action.id))
    } else {
      return state.update('openedDictionaries', (value) => value.deleteAll(action.id))
    }
  },

  [actionTypes.SELECT_UNSELECT_DICTIONARIES]: (
    state: Map<any, any>,
    action: { type: string; payload: Map<any, any> | null }
  ) => {
    return state.update('selectedDictionaries', (value: Map<any, any>) => {
      if (action.payload === null) {
        return Map()
      } else if (action.payload.get('id')) {
        return value.has(action.payload.get('id'))
          ? value.delete(action.payload.get('id'))
          : value.set(action.payload.get('id'), action.payload)
      } else {
        return value.merge(action.payload)
      }
    })
  },

  [actionTypes.SELECT_UNSELECT_SUITES]: (
    state: Map<any, any>,
    action: { type: string; payload: Map<any, any> | null }
  ) => {
    return state.update('selectedSuites', (value: Map<any, any>) => {
      if (action.payload === null) {
        return Map()
      } else if (action.payload.get('id')) {
        return value.has(action.payload.get('id'))
          ? value.delete(action.payload.get('id'))
          : value.set(action.payload.get('id'), action.payload)
      } else {
        return value.merge(action.payload)
      }
    })
  },

  [actionTypes.EDITORS_FILTER]: (state: Map<any, any>, action: { type: string; payload: string | null }) => {
    if (action.payload === null) return state.update('editorsFilter', () => initialState.get('editorsFilter'))
    return state.update('editorsFilter', (value: Map<any, any>) =>
      value.update(action.payload, (value: boolean) => !value)
    )
  },
  [actionTypes.SCROLL_TO]: (state: Map<any, any>, action: { type: string; payload: string | number | null }) =>
    state.update('scrollTo', () => action.payload),
  [actionTypes.TOGGLE_FULLSCREEN]: (state: Map<any, any>, action: { type: string; payload: string | null }) =>
    state.update('fullscreenId', () => (state.get('fullscreenId') === action.payload ? null : action.payload)),
  [actionTypes.DISPLAY_DICTIONARY_EDITOR]: (
    state: Map<any, any>,
    action: { type: string; status: boolean; dictId: string; templateId: string }
  ) =>
    state.update('displayDictionaryEditor', (value: Map<string, boolean | string>) =>
      value
        .update('status', () => action.status)
        .update('dictId', () => action.dictId)
        .update('templateId', () => action.templateId)
    ),
  [actionTypes.SET_EDITORS_SORTING]: (state: Map<any, any>, action: { type: string; sort: string }) => {
    if (state.getIn(['editorsSorting', 'type']) === action.sort) {
      return state.update('editorsSorting', (value: Map<any, any>) => value.update('isAsc', (bool: boolean) => !bool))
    } else {
      return state.update('editorsSorting', (value: Map<any, any>) => value.update('type', () => action.sort))
    }
  },
  [actionTypes.UPDATE_TAB_TITLE]: (
    state: Map<any, any>,
    action: { type: string; profileId: string; suiteId: string; title: string }
  ) => {
    if (state.getIn(['openedTabs', action.profileId, action.suiteId])) {
      return state.updateIn(['openedTabs', action.profileId, action.suiteId], (value: Map<any, any>) =>
        value.set('title', action.title)
      )
    } else {
      return state
    }
  },
  [actionTypes.LAST_COMPILATION_DATE]: (state: Map<any, any>, action: { type: string, date: Map<any, any> }) =>
    state.update('lastCompilationDate', () => action.date),
}

export default (state = initialState, action: RandomObject) => createReducer(editorsReducer, state, action)
