import * as types from './actions/actionTypes'
import * as actions from './actions'
import * as dispatcher from './dispatcher'
import { Map, Set } from 'immutable'

describe('Actions and Dispatcher tests', () => {
  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.LOGOUT_USER,
    }
    expect(actions.logoutUser()).toEqual(expectedAction)
    expect(dispatcher.logoutUser()).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SAVE_AUTHENTICED_USER,
      data: {
        user: {},
        jwt: 'jwt',
      },
    }
    expect(actions.saveUserInfo(expectedAction.data)).toEqual(expectedAction)
    expect(dispatcher.saveUserInfo(expectedAction.data)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.STATUS_BAR_NOTIFICATION,
      status: true,
      data: {
        msg: 'msg',
        className: 'className',
        confirm: true,
        handler: jest.fn(),
        hideAfter: 1,
      },
    }
    expect(actions.setStatusBarNotification(expectedAction.data, expectedAction.status)).toEqual(expectedAction)
    expect(dispatcher.setStatusBarNotification(expectedAction.data, expectedAction.status)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.STATUS_BAR_SYNCING,
      status: true,
      data: { msg: 'msg', className: 'className', confirm: true, handler: jest.fn(), hideAfter: 1 },
    }
    expect(actions.setStatusBarSyncing(expectedAction.data, expectedAction.status)).toEqual(expectedAction)
    expect(dispatcher.setStatusBarSyncing(expectedAction.data, expectedAction.status)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.TOOLBAR_IS_HIDDEN,
      status: false,
    }
    expect(actions.toolbarIsHidden(expectedAction.status)).toEqual(expectedAction)
    expect(dispatcher.toolbarIsHidden(expectedAction.status)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SET_SEARCH_VALUES,
      category: 'category',
      payload: ['value1', 'value2'],
    }
    expect(actions.setSearchValues(expectedAction.category, expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.setSearchValues(expectedAction.category, expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.PROFILE_IS_SELECTED,
      payload: null,
    }
    expect(actions.selectProfile(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.selectProfile(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.ACTIVE_TAB,
      payload: null,
    }
    expect(actions.setActiveTab(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.setActiveTab(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const dateMock = Date.now()
    const expectedAction = {
      type: types.OPENED_TABS,
      profileId: 'profileId',
      id: 'id',
      opened: dateMock,
      title: 'title',
    }
    expect(
      actions.setOpenedTabs(expectedAction.profileId, expectedAction.id, expectedAction.opened, expectedAction.title)
    ).toEqual(expectedAction)
    expect(
      dispatcher.setOpenedTabs(expectedAction.profileId, expectedAction.id, expectedAction.opened, expectedAction.title)
    ).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.CLOSE_TAB,
      profileId: 'profileId',
      id: 'id',
    }
    expect(actions.closeOpenedTab(expectedAction.profileId, expectedAction.id)).toEqual(expectedAction)
    expect(dispatcher.closeOpenedTab(expectedAction.profileId, expectedAction.id)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.OPENED_DICTIONARIES,
      id: 'id',
      opened: 0,
    }
    expect(actions.setOpenedDictionaries(expectedAction.id, expectedAction.opened)).toEqual(expectedAction)
    expect(dispatcher.setOpenedDictionaries(expectedAction.id, expectedAction.opened)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.CLOSE_DICTIONARY,
      id: 'id',
    }
    expect(actions.closeDictionary(expectedAction.id)).toEqual(expectedAction)
    expect(dispatcher.closeDictionary(expectedAction.id)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SELECT_UNSELECT_DICTIONARIES,
      payload: Map(),
    }
    expect(actions.selectUnselectDictionaries(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.selectUnselectDictionaries(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SET_DICTIONARIES_SORTING,
      sortType: 'itemsType',
      category: 'all',
    }
    expect(actions.setDictionariesSorting(expectedAction.sortType, expectedAction.category)).toEqual(expectedAction)
    expect(dispatcher.setDictionariesSorting(expectedAction.sortType, expectedAction.category)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.EDITORS_FILTER,
      payload: 'payload',
    }
    expect(actions.setEditorsFilter(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.setEditorsFilter(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SELECT_UNSELECT_SUITES,
      payload: Map(),
    }
    expect(actions.selectUnselectSuites(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.selectUnselectSuites(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.TEMPLATES_PINNED,
      suiteId: 'suiteId',
      id: 'id',
      template: {
        id: 'templateId',
        position: 1,
        content: 'content',
        created: 1,
        updated: 2,
        is_enabled: true,
        profile_id: 'profile_id',
        suite_id: 'suite_id',
        suite_title: 'suite_title',
        meta: {
          title: 'title',
          description: 'description',
          last_user: {
            uuid: 'uuid',
            name: 'name',
            username: 'username',
            user_role: 'user_role',
          },
        },
        stats: {
          last_used: 'last_used',
          used_7d: 0,
          used_30d: 1,
        },
      },
    }
    expect(actions.setPinnedTemplates(expectedAction.suiteId, expectedAction.id, expectedAction.template)).toEqual(
      expectedAction
    )
    expect(dispatcher.setPinnedTemplates(expectedAction.suiteId, expectedAction.id, expectedAction.template)).toEqual(
      expectedAction
    )
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SCROLL_TO,
      payload: null,
    }
    expect(actions.scrollToTemplate(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.scrollToTemplate(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SCROLL_TO,
      payload: null,
    }
    expect(actions.scrollToDictionary(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.scrollToDictionary(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', async () => {
    const expectedAction = {
      type: types.UPDATE_SETTINGS,
      payload: Map(),
    }

    expect(actions.updateUserSettings(expectedAction.payload)).toEqual(expectedAction)
    //await expect(dispatcher.updateUserSettings(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.STORE_ERROR_MESSAGE,
      error: 'Some error message',
    }
    expect(actions.storeErrorMessage(expectedAction.error)).toEqual(expectedAction)
    expect(dispatcher.storeErrorMessage(expectedAction.error)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.TOGGLE_FULLSCREEN,
      payload: null,
    }
    expect(actions.toggleFullscreen(expectedAction.payload)).toEqual(expectedAction)
    expect(dispatcher.toggleFullscreen(expectedAction.payload)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.CHECK_ALL_DICTIONARIES,
      category: 'common',
    }
    expect(actions.setDictionariesChecked(expectedAction.category)).toEqual(expectedAction)
    expect(dispatcher.setDictionariesChecked(expectedAction.category)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.CHECK_ALL_SUITES,
      value: true,
    }
    expect(actions.setSuitesChecked(expectedAction.value)).toEqual(expectedAction)
    expect(dispatcher.setSuitesChecked(expectedAction.value)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SET_SUITES_SORTING,
      value: 'value',
    }
    expect(actions.setSuitesSorting(expectedAction.value)).toEqual(expectedAction)
    expect(dispatcher.setSuitesSorting(expectedAction.value)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SELECT_ACCOUNT,
      account: Map({ account: 'account' }),
    }
    expect(actions.selectAccount(expectedAction.account)).toEqual(expectedAction)
    expect(dispatcher.selectAccount(expectedAction.account)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.TOOLBAR_UTILITY,
      id: 'replace',
    }
    expect(actions.showToolbarUtility(expectedAction.id)).toEqual(expectedAction)
    expect(dispatcher.showToolbarUtility(expectedAction.id)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.LAST_COMPILATION_DATE,
      date: Map(),
    }
    expect(actions.setCompilationDate(expectedAction.date)).toEqual(expectedAction)
    expect(dispatcher.setCompilationDate(expectedAction.date)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.SET_EDITORS_SORTING,
      sort: 'position',
    }
    expect(actions.setEditorsSorting(expectedAction.sort)).toEqual(expectedAction)
    expect(dispatcher.setEditorsSorting(expectedAction.sort)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.UPDATE_TAB_TITLE,
      profileId: 'profileId',
      suiteId: 'suiteId',
      title: 'title',
    }
    expect(actions.updateTabTitle(expectedAction.profileId, expectedAction.suiteId, expectedAction.title)).toEqual(
      expectedAction
    )
    expect(dispatcher.updateTabTitle(expectedAction.profileId, expectedAction.suiteId, expectedAction.title)).toEqual(
      expectedAction
    )
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.ALL_DICTS_LOADED,
      value: true,
    }
    expect(actions.setDictsLoadingStatus(expectedAction.value)).toEqual(expectedAction)
    expect(dispatcher.setDictsLoadingStatus(expectedAction.value)).toEqual(expectedAction)
  })

  it('dispatches the same object that was passed through action', () => {
    const expectedAction = {
      type: types.ALL_SUITES_LOADED,
      profileId: 'profileId',
      value: true,
    }
    expect(actions.setSuitesLoadingStatus(expectedAction.profileId, expectedAction.value)).toEqual(expectedAction)
    expect(dispatcher.setSuitesLoadingStatus(expectedAction.profileId, expectedAction.value)).toEqual(expectedAction)
  })
})
