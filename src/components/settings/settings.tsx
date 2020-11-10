import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Toggle from '../common/toggle'
import CustomSelect from '../common/customSelect'
import { updateUserSettings } from '../../store/dispatcher'
import CustomInput from '../common/customInput'
import { ReduxState } from '../../store/store'
import { Map, fromJS } from 'immutable'
import ScrollbarCustom from '../common/customScrollbar'
import Icon from '../common/icon'

interface SettingsProps {
  currentPath: string
  userSettings: Map<any, any>
  currentUser: Map<any, any>
  quickSettings?: {
    route: string
    group: string
  }
}

export class Settings extends PureComponent<SettingsProps> {
  avatar = React.createRef<HTMLInputElement>()

  getCurrentRoute = () => {
    return this.props.quickSettings
      ? this.props.quickSettings.route
      : this.props.currentPath.slice(1, -1).split('/').pop()
  }

  updateValue = async (
    settingsGroup: string,
    settings: string,
    paramId: string,
    paramNewValue: string | boolean | Map<any, any>
  ) => {
    const settingsRoute = this.getCurrentRoute()
    updateUserSettings(
      this.props.userSettings.updateIn(
        [settingsRoute, settingsGroup, settings, paramId, 'value'],
        () => paramNewValue
      )
    )
  }

  getInputParam = (item: Map<any, any>, param: Map<any, any>) => {
    if (item.get('isUser')) {
      if (this.props.currentUser.getIn([param.get('id'), 'name'])) {
        return this.props.currentUser.getIn([param.get('id'), 'name'])
      } else {
        return this.props.currentUser.get(param.get('id')) || 'null'
      }
    } else {
      return param.get('value')
    }
  }

  render() {
    const { userSettings, currentUser, quickSettings } = this.props
    const settingsRoute = this.getCurrentRoute()
    let settingsToRender: Map<any, any> = Map()
    if (quickSettings) {
      settingsToRender = Map(
        fromJS({
          [quickSettings.route]: {
            [quickSettings.group]: userSettings.getIn([quickSettings.route, quickSettings.group]),
          },
        })
      )
    } else {
      settingsToRender = userSettings
    }
    return (
      <ScrollbarCustom className="settings-list-wrapper">
        <ul className={`settings-list${quickSettings ? ' quick-settings' : ''}`}>
          {settingsToRender.get(settingsRoute)
            ? settingsToRender
                .get(settingsRoute)
                .toList()
                .sort((a: Map<any, any>, b: Map<any, any>) => (a.get('sort') < b.get('sort') ? -1 : 1))
                .map((item: Map<any, any>, itemIndex: number) =>
                  item.get('params') ? (
                    <li className="settings-list-item" key={itemIndex}>
                      {(item.get('title') || item.get('subtitle')) && !quickSettings && (
                        <div className="settings-item-header">
                          {!!item.get('title') && <div className="settings-item-title">{item.get('title')}</div>}
                          {!!item.get('subtitle') && (
                            <div className="settings-item-subtitle">{item.get('subtitle')}</div>
                          )}
                        </div>
                      )}
                      <ul className="settings-item-params">
                        {item
                          .get('params')
                          .toList()
                          .map((param: Map<any, any>, paramIndex: number) => {
                            const pathToEditorConfigs = settingsToRender.getIn([settingsRoute, 'visual'])
                            const id = param.get('id')
                            return (param.get('id') === 'groups' &&
                              currentUser.get('groups') &&
                              currentUser.get('groups').size) ||
                              param.get('id') !== 'groups' ? (
                              <li className="settings-params-item" key={paramIndex}>
                                <div className="settings-param-name">{param.get('name')}</div>
                                <div className="settings-param-value">
                                  {param.get('type') === 'toggle' ? (
                                    <Toggle
                                      id={param.get('id')}
                                      value={pathToEditorConfigs.getIn(['clientSettings', id, 'value'])}
                                      handler={() =>
                                        this.updateValue(
                                          settingsToRender.get(settingsRoute).keySeq().get(0),
                                          'clientSettings',
                                          param.getIn(['id']),
                                          !pathToEditorConfigs.getIn(['clientSettings', id, 'value'])
                                        )
                                      }
                                    />
                                  ) : param.get('type') === 'select' ? (
                                    <CustomSelect
                                      group={settingsToRender.get(settingsRoute).keySeq().get(itemIndex)}
                                      id={param.get('id')}
                                      value={item.getIn(['clientSettings', id, 'value'])}
                                      options={param.get('options')}
                                      updateValue={this.updateValue}
                                      defaultPlaceholder="Выберите вариант"
                                    />
                                  ) : param.get('type') === 'avatar' ? (
                                    <div className="settings-avatar">
                                      <Icon icon={['fas', 'user-circle']} />
                                    </div>
                                  ) : param.get('type') === 'input' ? (
                                    <CustomInput
                                      group={settingsToRender.get(settingsRoute).keySeq().get(itemIndex)}
                                      id={param.get('id')}
                                      value={this.getInputParam(item, param)}
                                      updateValue={this.updateValue}
                                      disabled={!!param.get('disabled')}
                                    />
                                  ) : null}
                                </div>
                              </li>
                            ) : null
                          })}
                      </ul>
                    </li>
                  ) : null
                )
            : null}
        </ul>
      </ScrollbarCustom>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
  userSettings: state.settings.get('userSettings'),
  currentUser: state.auth.get('user'),
})

export default connect(mapStateToProps)(Settings)
