import { Map, fromJS } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { TemplateItem } from '../../components/editor/editors'
import { RandomObject } from '../../@types/common'

const initialState = Map(
  fromJS({
    toolbarIsHidden: false,
    templatesPinned: {},
    checkAllSuites: false,
    checkAllDictionaries: {
      private: false,
      all: false,
    },
    suitesSorting: {
      type: 'title',
      isAsc: true,
    },
    dictionariesSorting: { all: { sortType: 'title', isAsc: true }, private: { sortType: 'title', isAsc: true } },
    toolbarUtility: '',
    allDictsLoaded: false,
    allSuitesLoaded: {},
    showHiddenSuites: false,
    showHiddenDicts: false,
  })
)

const toolbarReducer = {
  [actionTypes.LOGOUT_USER]: (state: Map<any, any>) => state.update(() => initialState),

  [actionTypes.TOOLBAR_IS_HIDDEN]: (state: Map<any, any>, payload: { type: string; status: boolean }) =>
    state.update('toolbarIsHidden', () => payload.status),

  [actionTypes.TEMPLATES_PINNED]: (
    state: Map<any, any>,
    action: { type: string; suiteId: string; id: string | null; template: TemplateItem | null }
  ) => {
    if (state.get('templatesPinned').has(action.suiteId)) {
      if (action.id === null) {
        return state.update('templatesPinned', (value: Map<any, any>) => value.delete(action.suiteId))
      } else {
        return state.updateIn(['templatesPinned', action.suiteId], (value: Map<any, any>) =>
          value.has(action.id)
            ? action.template === null
              ? value.delete(action.id)
              : value.update(action.id, () => Map(fromJS(action.template)))
            : value.set(action.id, Map(fromJS(action.template)))
        )
      }
    } else {
      return state.update('templatesPinned', (value: Map<any, any>) =>
        value.set(action.suiteId, Map().set(action.id, Map(fromJS(action.template))))
      )
    }
  },

  [actionTypes.CHECK_ALL_SUITES]: (state: Map<any, any>, action: { type: string; value: boolean }) =>
    state.update('checkAllSuites', () => action.value),

  [actionTypes.CHECK_ALL_DICTIONARIES]: (state: Map<any, any>, action: { type: string; category: string | null }) =>
    state.update('checkAllDictionaries', (value: Map<any, any>) => {
      if (!action.category) {
        return Map({
          private: false,
          all: false,
        })
      } else {
        return value.update(action.category, (bool: boolean) => !bool)
      }
    }),

  [actionTypes.SET_SUITES_SORTING]: (state: Map<any, any>, action: { type: string; value: string }) => {
    if (state.getIn(['suitesSorting', 'type']) === action.value) {
      return state.update('suitesSorting', (value: Map<any, any>) => value.update('isAsc', (bool: boolean) => !bool))
    } else {
      return state.update('suitesSorting', (value: Map<any, any>) => value.update('type', () => action.value))
    }
  },

  [actionTypes.SET_DICTIONARIES_SORTING]: (
    state: Map<any, any>,
    action: { type: string; sortType: string; category: string }
  ) => {
    if (state.getIn(['dictionariesSorting', action.category]).get('sortType') === action.sortType) {
      return state.updateIn(['dictionariesSorting', action.category], (value: Map<any, any>) => {
        return value.update('isAsc', (bool: boolean) => !bool)
      })
    } else {
      return state.updateIn(['dictionariesSorting', action.category], (value: Map<any, any>) => {
        return value.update('sortType', () => action.sortType)
      })
    }
  },

  [actionTypes.TOOLBAR_UTILITY]: (state: Map<any, any>, action: { type: string; id: string }) => {
    return state.update('toolbarUtility', () => action.id)
  },

  [actionTypes.ALL_DICTS_LOADED]: (state: Map<any, any>, action: { type: string; value: boolean }) =>
    state.update('allDictsLoaded', () => action.value),

  [actionTypes.ALL_SUITES_LOADED]: (state: Map<any, any>, action: { type: string; profileId: string, value: boolean }) =>
    state.update('allSuitesLoaded', (value: Map<any, any>) => value.set(action.profileId, action.value)),

  [actionTypes.TOGGLE_HIDDEN_SUITES]: (state: Map<any, any>, action: { type: string; value: boolean }) =>
    state.update('showHiddenSuites', () => action.value),

  [actionTypes.TOGGLE_HIDDEN_DICTS]: (state: Map<any, any>, action: { type: string; value: boolean }) =>
    state.update('showHiddenDicts', () => action.value),
}

export default (state = initialState, action: RandomObject) => createReducer(toolbarReducer, state, action)
