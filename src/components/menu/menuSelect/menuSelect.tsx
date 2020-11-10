import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as utils from '../../../utils/common'
import { selectProfile, setActiveTab } from '../../../store/dispatcher'
import MenuSelectDropDown from '../menuSelectDropDown/menuSelectDropDown'
import {
  PROFILE_CREATE_MUTATION,
  PROFILE_QUERIES_GQL,
  PROFILE_QUERIES_GQL_SYS_ADMIN,
} from '../../../graphql/queries/profilesQueries'
import { connect } from 'react-redux'
import Icon from '../../common/icon'
import { Mutation } from 'react-apollo'
import { ReduxState } from '../../../store/store'
import { Map } from 'immutable'
import withArrowNavigation from '../../../hocs/withArrowNavigation'
import { getProfilesConfig } from '../../../utils/queries'
import { notifyWithDelay } from '../../../utils/common'

export interface ProfileItem {
  id: string
  name: string
  is_enabled: boolean
  permissions: {
    [permission_key: string]: boolean | null
  }
}

interface MenuSelectProps {
  items: ProfileItem[]
  selectedProfile: ProfileItem
  currentUser: Map<any, any>
  openedTabs: Map<any, any>
  selectedAccount: Map<any, any>
}

interface MenuSelectState {
  isDroppedDown: boolean
  filteredData: ProfileItem[]
  value: string
  profileNameValue: string
  showNewProfileDialog: boolean
}

export class MenuSelect extends PureComponent<MenuSelectProps, MenuSelectState> {
  state = {
    isDroppedDown: false,
    filteredData: [],
    value:
      this.props.selectedProfile.name ||
      (this.props.selectedProfile.id ? `ПРОФИЛЬ (${this.props.selectedProfile.id})` : ''),
    profileNameValue: '',
    showNewProfileDialog: false,
  }

  inputRef = React.createRef<HTMLInputElement>()

  setDropDown = (bool: boolean) => {
    this.setState(() => ({ isDroppedDown: bool }))
  }

  onInputData = (ev: React.FormEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value
    const filteredData = this.props.items.length
      ? this.props.items.filter(item => utils.filterList(item.name, value))
      : []
    this.setState(() => ({ filteredData, value }))
  }

  setProfileName = (ev: React.FormEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value
    this.setState(() => ({ profileNameValue: value }))
  }

  onSelectDropDownItem = (item: ProfileItem) => {
    this.setState(() => ({
      value: item.name ? item.name : `ПРОФИЛЬ (${item.id})`,
    }))
    selectProfile(item)
    if (this.props.openedTabs && this.props.openedTabs.get(item.id) && this.props.openedTabs.get(item.id).size) {
      setActiveTab(
        this.props.openedTabs
          .get(item.id)
          .last()
          .get('id')
      )
    } else {
      setActiveTab(null)
    }
  }

  clearInput = () => {
    this.setState(() => ({
      value: '',
      filteredData: [],
    }))
    this.setDropDown(false)
  }

  onToggleButtonClick = () => {
    if (!this.state.filteredData.length) {
      this.setState(() => ({
        filteredData: this.props.items,
      }))
    }
    if (!this.state.isDroppedDown) this.setDropDown(true)
  }

  checkSelectedProfile = () => {
    let isAllowed = false
    this.props.items.forEach(item => {
      if (item.id === this.props.selectedProfile.id) {
        isAllowed = true
        selectProfile(item)
      }
    })
    if (!isAllowed) selectProfile(null)
  }

  componentDidMount() {
    this.checkSelectedProfile()
  }

  componentDidUpdate(prevProps: Readonly<MenuSelectProps>, prevState: Readonly<MenuSelectState>) {
    if (prevProps.selectedProfile !== this.props.selectedProfile && this.props.selectedProfile) {
      this.setState(() => ({
        value:
          this.props.selectedProfile.name ||
          (this.props.selectedProfile.id ? `ПРОФИЛЬ (${this.props.selectedProfile.id})` : ''),
      }))
    }

    if (prevProps.items !== this.props.items) {
      this.checkSelectedProfile()
    }
  }

  render() {
    const activeDropDown = this.state.isDroppedDown ? 'active' : ''
    const { value, profileNameValue, showNewProfileDialog, filteredData } = this.state
    const { selectedProfile, currentUser, selectedAccount } = this.props
    const ArrowNavComponentWrapper = withArrowNavigation(MenuSelectDropDown)
    const isSysAdmin = currentUser.getIn(['role', 'type']) === 'sys_admin'

    return (
      <div className="menu-select">
        <div className="menu-bar-visible">
          <input
            className="menu-select-input"
            onChange={e => {
              this.onInputData(e)
              !this.state.isDroppedDown && this.setDropDown(true)
            }}
            onFocus={this.onToggleButtonClick}
            type="text"
            value={value}
            ref={this.inputRef}
            title={value}
            placeholder="Выберите профиль"
            data-id={selectedProfile.id || ''}
          />
          {value && (
            <button
              type="button"
              className="menu-select-clear"
              onClick={() => {
                this.clearInput()
                this.inputRef.current!.focus()
              }}
            >
              <FontAwesomeIcon size="xs" className="menu-select-clear" icon={['fas', 'times']} />
            </button>
          )}
          <button
            onClick={this.onToggleButtonClick}
            className={`menu-select-toggle-dropdown ${activeDropDown}`}
            type="button"
          >
            <FontAwesomeIcon icon={['fas', 'caret-down']} />
          </button>
        </div>
        {this.state.isDroppedDown && (
          <ArrowNavComponentWrapper
            selectedProfileId={selectedProfile.id}
            exceptions={['menu-select-input', 'menu-select-clear']}
            setDropDown={this.setDropDown}
            onSelectDropDownItem={this.onSelectDropDownItem}
            data={filteredData.sort((a: ProfileItem, b: ProfileItem) => {
              const name1 = a.name || `ПРОФИЛЬ (${a.id})`
              const name2 = b.name || `ПРОФИЛЬ (${b.id})`
              return name1.localeCompare(name2)
            })}
            selectedProfile={selectedProfile.id || ''}
            isSysAdmin={isSysAdmin}
          />
        )}
        {isSysAdmin && (
          <Mutation
            mutation={PROFILE_CREATE_MUTATION}
            variables={{ name: profileNameValue }}
            refetchQueries={() => [
              {
                query: isSysAdmin ? PROFILE_QUERIES_GQL_SYS_ADMIN : PROFILE_QUERIES_GQL,
                variables: getProfilesConfig(currentUser, selectedAccount),
              },
            ]}
            onCompleted={(data: any) => {
              const { id, name, is_enabled } = data.profilesMutations.response
              const item = {
                id,
                name,
                is_enabled,
                permissions: {
                  dl_read: true,
                  dl_write: true,
                  dict_read: true,
                  dict_write: true,
                },
              }
              this.onSelectDropDownItem(item)
              notifyWithDelay({ msg: 'Профиль успешно создан!', hideAfter: 2000 })
            }}
          >
            {(mutation: () => void) => (
              <>
                <button
                  onClick={() => {
                    this.setState(prevState => ({
                      isDroppedDown: false,
                      showNewProfileDialog: !prevState.showNewProfileDialog,
                      profileNameValue: '',
                    }))
                  }}
                  className={`menu-select-add-profile${showNewProfileDialog ? ' cancel active' : ''}`}
                >
                  <Icon icon={['fas', showNewProfileDialog ? 'ban' : 'plus']} />
                </button>
                {showNewProfileDialog && (
                  <>
                    <input
                      value={profileNameValue}
                      onChange={e => this.setProfileName(e)}
                      placeholder="Введите название профиля"
                      className="menu-select-add-profile-input menu-select-input"
                      autoFocus={true}
                      onKeyDown={e => {
                        if (e.keyCode === 13) {
                          if (profileNameValue !== '') {
                            mutation()
                            this.setState(prevState => ({
                              showNewProfileDialog: !prevState.showNewProfileDialog,
                              profileNameValue: '',
                            }))
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (profileNameValue !== '') {
                          mutation()
                          this.setState(prevState => ({
                            showNewProfileDialog: !prevState.showNewProfileDialog,
                            profileNameValue: '',
                          }))
                        }
                      }}
                      className={`menu-select-add-profile${showNewProfileDialog ? ' active' : ''}`}
                    >
                      <Icon icon={['far', 'save']} />
                    </button>
                  </>
                )}
              </>
            )}
          </Mutation>
        )}
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  selectedProfile: state.profiles.get('selectedProfile'),
  openedTabs: state.editors.get('openedTabs'),
  currentUser: state.auth.get('user'),
  selectedAccount: state.profiles.get('selectedAccount'),
})

export default connect(mapStateToProps)(MenuSelect)
