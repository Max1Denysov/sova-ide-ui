import { store } from './store'
import * as actions from './actions'
import { Map, Set } from 'immutable'
import { TemplateItem } from '../components/editor/editors'
import { ProfileItem } from '../components/menu/menuSelect/menuSelect'
import { RandomObject } from '../@types/common'
import { StatusBarDataProps } from '../components/statusBar/statusBar'
import { CustomConfirmData } from '../components/common/customConfirm'

export const saveUserInfo = (data: { user: RandomObject; jwt: string }) => {
  return store.dispatch(actions.saveUserInfo(data))
}

export const logoutUser = () => {
  return store.dispatch(actions.logoutUser())
}

export const setStatusBarNotification = (data: StatusBarDataProps, status: boolean = true) => {
  return store.dispatch(actions.setStatusBarNotification(data, status))
}

export const setCustomConfirmConfig = (data: CustomConfirmData) => {
  return store.dispatch(actions.setCustomConfirmConfig(data))
}

export const setStatusBarSyncing = (data: StatusBarDataProps, status: boolean = true) => {
  return store.dispatch(actions.setStatusBarSyncing(data, status))
}

export const toolbarIsHidden = (status: boolean) => {
  return store.dispatch(actions.toolbarIsHidden(status))
}

export const setSearchValues = (category: string, payload: string[]) => {
  return store.dispatch(actions.setSearchValues(category, payload))
}

export const selectProfile = (payload: ProfileItem | null) => {
  return store.dispatch(actions.selectProfile(payload))
}

export const setActiveTab = (payload: string | null) => {
  return store.dispatch(actions.setActiveTab(payload))
}

export const setOpenedTabs = (profileId: string, id: string, opened: number, title?: string) => {
  return store.dispatch(actions.setOpenedTabs(profileId, id, opened, title))
}

export const closeOpenedTab = (profileId: string, id: string | null) => {
  return store.dispatch(actions.closeOpenedTab(profileId, id))
}

export const setOpenedDictionaries = (id: string, opened: number) => {
  return store.dispatch(actions.setOpenedDictionaries(id, opened))
}

export const closeDictionary = (id: string | Set<string>) => {
  return store.dispatch(actions.closeDictionary(id))
}

export const selectUnselectDictionaries = (payload: Map<any, any> | null) => {
  return store.dispatch(actions.selectUnselectDictionaries(payload))
}

export const setDictionariesSorting = (sortType: string, category: string) => {
  return store.dispatch(actions.setDictionariesSorting(sortType, category))
}

export const setEditorsFilter = (payload: string | null) => {
  return store.dispatch(actions.setEditorsFilter(payload))
}

export const displayDictionaryEditor = (status: boolean, dictId: string, templateId?: string) => {
  return store.dispatch(actions.displayDictionaryEditor(status, dictId, templateId))
}

export const selectUnselectSuites = (payload: Map<any, any> | null) => {
  return store.dispatch(actions.selectUnselectSuites(payload))
}

export const setPinnedTemplates = (suiteId: string, id: string | null, template: TemplateItem | null) => {
  return store.dispatch(actions.setPinnedTemplates(suiteId, id, template))
}

export const scrollToTemplate = (payload: string | number | null) => {
  return store.dispatch(actions.scrollToTemplate(payload))
}

export const scrollToDictionary = (payload: string | number | null) => {
  return store.dispatch(actions.scrollToDictionary(payload))
}

export const updateUserSettings = async (payload: Map<any, any>) => {
  return store.dispatch(actions.updateUserSettings(payload))
}

export const loadClientSettings = async (sett: Map<any, any>) => {
  return store.dispatch(actions.loadUserSettings(sett))
}

export const toggleFullscreen = (payload: string | null) => {
  return store.dispatch(actions.toggleFullscreen(payload))
}

export const setSuitesChecked = (bool: boolean) => {
  return store.dispatch(actions.setSuitesChecked(bool))
}

export const setDictionariesChecked = (category: string | null) => {
  return store.dispatch(actions.setDictionariesChecked(category))
}

export const setSuitesSorting = (value: string) => {
  return store.dispatch(actions.setSuitesSorting(value))
}

export const selectAccount = (account: Map<any, any>) => {
  return store.dispatch(actions.selectAccount(account))
}

export const setAccountComplect = (complect: Map<any, any>) => {
  return store.dispatch(actions.setAccountComplect(complect))
}

export const storeErrorMessage = (error: string) => {
  return store.dispatch(actions.storeErrorMessage(error))
}

export const showToolbarUtility = (id: string) => {
  return store.dispatch(actions.showToolbarUtility(id))
}

export const setCompilationDate = (date: Map<any, any>) => {
  return store.dispatch(actions.setCompilationDate(date))
}

export const setEditorsSorting = (sort: string) => {
  return store.dispatch(actions.setEditorsSorting(sort))
}

export const updateTabTitle = (profileId: string, suiteId: string, title: string) => {
  return store.dispatch(actions.updateTabTitle(profileId, suiteId, title))
}

export const setDictsLoadingStatus = (value: boolean) => {
  return store.dispatch(actions.setDictsLoadingStatus(value))
}

export const setSuitesLoadingStatus = (profileId: string, value: boolean) => {
  return store.dispatch(actions.setSuitesLoadingStatus(profileId, value))
}

export const toggleHiddenSuites = (value: boolean) => {
  return store.dispatch(actions.toggleHiddenSuites(value))
}

export const toggleHiddenDicts = (value: boolean) => {
  return store.dispatch(actions.toggleHiddenDicts(value))
}
