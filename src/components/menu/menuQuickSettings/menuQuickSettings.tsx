import React, { PureComponent } from 'react'
import { Map } from 'immutable'
import { updateUserSettings } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import Icon from '../../common/icon'

interface ToolbarQuickSettingsProps {
  settingsRoute: string
  settingsGroup: string
  userSettings: Map<any, any>
}

export class MenuQuickSettings extends PureComponent<ToolbarQuickSettingsProps> {
  updateValue = (
    settingsGroup: string,
    settings: string,
    paramId: string,
    paramNewValue: string | boolean | Map<any, any>
  ) => {
    updateUserSettings(
      this.props.userSettings.updateIn(['common', settingsGroup, settings, paramId, 'value'], () => paramNewValue)
    )
  }

  render() {
    const { settingsRoute, settingsGroup, userSettings } = this.props
    const settingsToRender = userSettings.getIn([settingsRoute, settingsGroup, 'params'])
    const commonSettings = Map(userSettings.getIn([settingsRoute, settingsGroup, 'clientSettings']))
    return settingsToRender && settingsToRender.size > 0 ? (
      <>
        {settingsToRender.toList().map((param: Map<any, any>, paramIndex: number) => {
          return (
            <li key={paramIndex} className="subnav-item">
              <div className="subnav-link">
                {param.get('name')}
                <Icon icon={['fas', 'caret-right']} />
              </div>
              <ul className="subnav subnav-options">
                {param.get('type') === 'select'
                  ? param.get('options').map((option: Map<any, any>, optionIndex: number) => {
                      const id = param.get('id')
                      const currentValue = commonSettings.getIn([id, 'value', 'value'])
                      const isSelected = currentValue === option.get('value')
                      return (
                        <li
                          key={optionIndex}
                          className={`subnav-link${isSelected ? ' selected' : ''}`}
                          onClick={() => this.updateValue(settingsGroup, 'clientSettings', param.get('id'), option)}
                        >
                          {option.get('name')}
                          {isSelected && <Icon icon={['far', 'check-circle']} />}
                        </li>
                      )
                    })
                  : param.get('type') === 'toggle' && (
                      <>
                        <li
                          className={`subnav-link${
                            commonSettings.getIn(['animationEnabled', 'value']) ? ' selected' : ''
                          }`}
                          onClick={() =>
                            this.updateValue(
                              settingsGroup,
                              'clientSettings',
                              param.get('id'),
                              !commonSettings.getIn(['animationEnabled', 'value'])
                            )
                          }
                        >
                          Вкл
                          {commonSettings.getIn(['animationEnabled', 'value']) && (
                            <Icon icon={['far', 'check-circle']} />
                          )}
                        </li>
                        <li
                          className={`subnav-link${
                            !commonSettings.getIn(['animationEnabled', 'value']) ? ' selected' : ''
                          }`}
                          onClick={() => {
                            this.updateValue(
                              settingsGroup,
                              'clientSettings',
                              param.get('id'),
                              !commonSettings.getIn(['animationEnabled', 'value'])
                            )
                          }}
                        >
                          Выкл
                          {!commonSettings.getIn(['animationEnabled', 'value']) && (
                            <Icon icon={['far', 'check-circle']} />
                          )}
                        </li>
                      </>
                    )}
              </ul>
            </li>
          )
        })}
      </>
    ) : null
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  userSettings: state.settings.get('userSettings'),
})

export default connect(mapStateToProps)(MenuQuickSettings)
