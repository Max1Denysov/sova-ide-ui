import * as actions from './actionTypes'
import { Map, Set } from 'immutable'
import { TemplateItem } from '../../components/editor/editors'
import { ProfileItem } from '../../components/menu/menuSelect/menuSelect'
import { RandomObject } from '../../@types/common'
import { StatusBarDataProps } from '../../components/statusBar/statusBar'
import { CustomConfirmData } from '../../components/common/customConfirm'

export const saveUserInfo = (data: { user: RandomObject; jwt: string }) => ({
  type: actions.SAVE_AUTHENTICED_USER,
  data,
})

export const logoutUser = () => ({
  type: actions.LOGOUT_USER,
})

export const setStatusBarNotification = (data: StatusBarDataProps, status: boolean) => ({
  type: actions.STATUS_BAR_NOTIFICATION,
  data,
  status,
})

export const setCustomConfirmConfig = (data: CustomConfirmData) => ({
  type: actions.CUSTOM_CONFIG_NOTIFICATION,
  data,
})

export const setStatusBarSyncing = (data: StatusBarDataProps, status: boolean) => ({
  type: actions.STATUS_BAR_SYNCING,
  data,
  status,
})

export const toolbarIsHidden = (status: boolean) => ({
  type: actions.TOOLBAR_IS_HIDDEN,
  status,
})

export const setSearchValues = (category: string, payload: string[]) => {
  return {
    type: actions.SET_SEARCH_VALUES,
    category,
    payload,
  }
}

export const selectProfile = (payload: ProfileItem | null) => ({
  type: actions.PROFILE_IS_SELECTED,
  payload,
})

export const setActiveTab = (payload: string | null) => ({
  type: actions.ACTIVE_TAB,
  payload,
})

export const setOpenedTabs = (profileId: string, id: string, opened: number, title?: string) => ({
  type: actions.OPENED_TABS,
  profileId,
  id,
  opened,
  title,
})

export const closeOpenedTab = (profileId: string, id: string | null) => ({
  type: actions.CLOSE_TAB,
  profileId,
  id,
})

export const setOpenedDictionaries = (id: string, opened: number) => ({
  type: actions.OPENED_DICTIONARIES,
  id,
  opened,
})

export const closeDictionary = (id: string | Set<string>) => ({
  type: actions.CLOSE_DICTIONARY,
  id,
})

export const selectUnselectDictionaries = (payload: Map<any, any> | null) => ({
  type: actions.SELECT_UNSELECT_DICTIONARIES,
  payload,
})

export const setDictionariesSorting = (sortType: string, category: string) => ({
  type: actions.SET_DICTIONARIES_SORTING,
  sortType,
  category,
})

export const setEditorsFilter = (payload: string | null) => ({
  type: actions.EDITORS_FILTER,
  payload,
})

export const displayDictionaryEditor = (status: boolean, dictId: string, templateId?: string) => ({
  type: actions.DISPLAY_DICTIONARY_EDITOR,
  status,
  dictId,
  templateId,
})

export const selectUnselectSuites = (payload: Map<any, any> | null) => ({
  type: actions.SELECT_UNSELECT_SUITES,
  payload,
})

export const setPinnedTemplates = (suiteId: string, id: string | null, template: TemplateItem | null) => ({
  type: actions.TEMPLATES_PINNED,
  suiteId,
  id,
  template,
})

export const scrollToTemplate = (payload: string | number | null) => ({
  type: actions.SCROLL_TO,
  payload,
})

export const scrollToDictionary = (payload: string | number | null) => ({
  type: actions.SCROLL_TO,
  payload,
})

export const loadUserSettings = (settings?: Map<any, any>) => ({
  type: actions.LOAD_USER_SETTINGS,
  settings,
})

export const updateUserSettings = (payload: Map<any, any>) => ({
  type: actions.UPDATE_SETTINGS,
  payload,
})

export const toggleFullscreen = (payload: string | null) => ({
  type: actions.TOGGLE_FULLSCREEN,
  payload,
})

export const setSuitesChecked = (value: boolean) => ({
  type: actions.CHECK_ALL_SUITES,
  value,
})

export const setDictionariesChecked = (category: string | null) => ({
  type: actions.CHECK_ALL_DICTIONARIES,
  category,
})

export const setSuitesSorting = (value: string) => ({
  type: actions.SET_SUITES_SORTING,
  value,
})

export const selectAccount = (account: Map<any, any>) => ({
  type: actions.SELECT_ACCOUNT,
  account,
})

export const setAccountComplect = (complect: Map<any, any>) => ({
  type: actions.SELECTED_ACCOUNT_COMPLECT,
  complect,
})

export const storeErrorMessage = (error: string) => ({
  type: actions.STORE_ERROR_MESSAGE,
  error,
})

export const showToolbarUtility = (id: string) => ({
  type: actions.TOOLBAR_UTILITY,
  id,
})

export const setCompilationDate = (date: Map<any, any>) => ({
  type: actions.LAST_COMPILATION_DATE,
  date,
})

export const setEditorsSorting = (sort: string) => ({
  type: actions.SET_EDITORS_SORTING,
  sort,
})

export const updateTabTitle = (profileId: string, suiteId: string, title: string) => ({
  type: actions.UPDATE_TAB_TITLE,
  profileId,
  suiteId,
  title,
})

export const setDictsLoadingStatus = (value: boolean) => ({
  type: actions.ALL_DICTS_LOADED,
  value,
})

export const setSuitesLoadingStatus = (profileId: string, value: boolean) => ({
  type: actions.ALL_SUITES_LOADED,
  profileId,
  value,
})

export const toggleHiddenSuites = (value: boolean) => ({
  type: actions.TOGGLE_HIDDEN_SUITES,
  value,
})

export const toggleHiddenDicts = (value: boolean) => ({
  type: actions.TOGGLE_HIDDEN_DICTS,
  value,
})
