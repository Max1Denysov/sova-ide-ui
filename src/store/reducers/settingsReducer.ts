import { Map, fromJS } from 'immutable'
import { createReducer } from '../utils/storeUtiles'
import * as actionTypes from '../actions/actionTypes'
import { settingsConfig } from '../../routes/configs/settingsConfig'
import { RandomObject } from '../../@types/common'

const initialState = Map(
  fromJS({
    userSettings: settingsConfig,
    errorMessage: '',
  })
)

const settingsReducer = {
  [actionTypes.UPDATE_SETTINGS]: (state: Map<any, any>, action: { type: string; payload: Map<any, any> }) =>
    state.update('userSettings', () => action.payload),
  [actionTypes.LOAD_USER_SETTINGS]: (
    state: Map<any, any>,
    action: { type: Map<any, any>; settings: Map<any, any> }
  ) => {
    const { settings } = action
    const params = initialState.getIn(['userSettings', 'common', 'visual', 'params'])

    const themeDefault = params
      .getIn(['colorTheme', 'options'])
      .find((item: Map<any, any>) => item.get('value') === settings.get('theme'))
    const fontDefault = params
      .getIn(['fontFamily', 'options'])
      .find((item: Map<any, any>) => item.get('value') === settings.get('fontFamily'))
    const fontSizeDefault = params
      .getIn(['fontSize', 'options'])
      .find((item: Map<any, any>) => 's' + item.get('value') === settings.get('fontSize'))
    const animation = settings.get('animation')
    const editorsOpened = settings.get('editors_opened')
    const favTemplatesExpanded = settings.get('fav_templates_expanded')
    const commentsExpanded = settings.get('comments_expanded')
    const showLinesCount = settings.get('show_lines_count')

    const combinedSettings = Map(
      fromJS({
        colorTheme: {
          value: themeDefault,
        },
        fontFamily: {
          value: fontDefault,
        },
        fontSize: {
          value: fontSizeDefault,
        },
        animationEnabled: {
          value: animation,
        },
        editorsOpened: {
          value: editorsOpened,
        },
        favTemplatesExpanded: {
          value: favTemplatesExpanded,
        },
        commentsExpanded: {
          value: commentsExpanded,
        },
        showLinesCount: {
          value: showLinesCount,
        },
      })
    )
    return state.updateIn(['userSettings', 'common', 'visual', 'clientSettings'], () => combinedSettings)
  },
  [actionTypes.STORE_ERROR_MESSAGE]: (state: Map<any, any>, action: { type: string; error: string }) =>
    state.update('errorMessage', () => action.error),
}

export default (state = initialState, action: RandomObject) => createReducer(settingsReducer, state, action)
