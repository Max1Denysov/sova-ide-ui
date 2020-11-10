import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { setOpenedTabs, setActiveTab, selectUnselectSuites } from '../../../store/dispatcher'
import ToolbarTemplates from '../toolbarTemplates/toolbarTemplates'
import { ReduxState } from '../../../store/store'
import { Map, fromJS } from 'immutable'
import { getDate } from '../../../utils/common'
import OutBoundClick from '../../outboundClick/outBoundClick'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { SUITE_UPDATE_MUTATION } from '../../../graphql/queries/suitesQuery'
import debounce from 'lodash.debounce'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { getSuitesRefetchData } from '../../../utils/queries'
import { RandomObject } from '../../../@types/common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

export interface SuiteItem {
  id: string
  profile_id: string | null
  stat: {
    templates: number
  }
  is_enabled: boolean
  title: string
  updated: number
  hidden: boolean
}

type ToolbarSuiteOwnProps = {
  selectedProfile: ProfileItem
  suite: SuiteItem
  alwaysCollapsed?: boolean
  style?: RandomObject
}

interface ToolbarSuiteProps {
  selectedProfile: ProfileItem
  suite: SuiteItem
  isActiveTab: boolean
  isOpened: boolean
  templatesPinned: Map<any, any>
  animationEnabled: boolean
  isChecked: boolean
  isEnabled: boolean
  alwaysCollapsed?: boolean
  style?: RandomObject
  client: ApolloClient<NormalizedCacheObject>
  whenOpened: number
  dlReadOnly: boolean
}

interface ToolbarSuiteState {
  isCollapsed: boolean
  showCaret: boolean
  nameIsChanging: boolean
  newSuiteName: string
}

export class ToolbarSuite extends PureComponent<ToolbarSuiteProps, ToolbarSuiteState> {
  state = {
    isCollapsed: this.props.isOpened,
    showCaret: this.props.templatesPinned && this.props.templatesPinned.size ? true : false,
    nameIsChanging: false,
    newSuiteName: '',
  }

  checkPinned = () => {
    if (this.props.templatesPinned && this.props.templatesPinned.size) {
      if (!this.state.showCaret || !this.state.isCollapsed) {
        this.setState(() => ({ showCaret: true, isCollapsed: true }))
      }
    } else {
      if (!this.props.alwaysCollapsed && this.state.isCollapsed) {
        this.setState(() => ({ showCaret: false, isCollapsed: false }))
      } else {
        this.setState(() => ({ showCaret: false }))
      }
    }
  }

  checkSuite = () => {
    if (!this.props.suite.hidden) {
      selectUnselectSuites(Map(fromJS(this.props.suite)))
    }
  }

  toggleSuite = debounce((clicksCount: number) => {
    if (this.state.nameIsChanging || this.props.suite.hidden) return
    if (clicksCount === 1) {
      const suite = this.props.suite
      if (!this.props.isOpened) setOpenedTabs(this.props.selectedProfile.id, suite.id, Date.now(), suite.title)
      if (!this.props.isActiveTab) setActiveTab(suite.id)

      if (!this.props.alwaysCollapsed) {
        if (!this.state.isCollapsed) {
          this.setState({ isCollapsed: this.state.showCaret })
        }
      }
    } else if (clicksCount > 1) {
      if (this.props.dlReadOnly) return
      this.setState(() => ({ nameIsChanging: true }))
    }
  }, 300)

  handleNameChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const newSuiteName = ev.currentTarget.value
    this.setState(() => ({ newSuiteName }))
  }

  handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (!this.state.newSuiteName.trim() || this.state.newSuiteName.trim() === this.props.suite.title)
      return this.restoreInitialName()
    if (this.props.client) {
      await this.props.client.mutate({
        mutation: SUITE_UPDATE_MUTATION,
        variables: {
          params: {
            id: this.props.suite.id,
            title: this.state.newSuiteName,
          }
        },
        refetchQueries: () => getSuitesRefetchData(this.props.selectedProfile.id),
      })
      if (this.props.isOpened) {
        setOpenedTabs(
          this.props.selectedProfile.id,
          this.props.suite.id,
          this.props.whenOpened,
          this.state.newSuiteName
        )
      }
    }
  }

  restoreInitialName = () => {
    this.setState(() => ({ nameIsChanging: false, newSuiteName: '' }))
  }

  handleStateChange = () => {
    if (this.props.client && !this.props.suite.hidden) {
      this.props.client.mutate({
        mutation: SUITE_UPDATE_MUTATION,
        variables: {
          params: {
            id: this.props.suite.id,
            is_enabled: !this.props.suite.is_enabled,
          }
        },
        refetchQueries: () => getSuitesRefetchData(this.props.selectedProfile.id),
      })
    }
  }

  componentDidMount() {
    if (this.props.isChecked && this.props.isEnabled !== undefined && this.props.isEnabled !== this.props.suite.is_enabled) {
      selectUnselectSuites(Map().set(this.props.suite.id, this.props.suite))
    }
  }

  componentDidUpdate(prevProps: Readonly<ToolbarSuiteProps>, prevState: Readonly<ToolbarSuiteState>) {
    if (prevProps.isOpened && !this.props.isOpened) {
      if (this.state.isCollapsed) this.setState({ isCollapsed: false })
    }

    if (prevProps.templatesPinned !== this.props.templatesPinned) this.checkPinned()
  }

  render() {
    const { suite, templatesPinned, animationEnabled, isChecked, isActiveTab, isOpened, style, dlReadOnly } = this.props
    const { isCollapsed, showCaret, nameIsChanging } = this.state
    return (
      <div className={`toolbar-file${nameIsChanging ? ' changing' : ''}`} style={style}>
        <div className={`toolbar-file-header${suite.hidden ? ' is-hidden' : ''}`} data-id={suite.id}>
          {!dlReadOnly && (
            <>
              <button className={`toolbar-file-select${isChecked ? ' checked' : ''}`} onClick={this.checkSuite}>
                <Icon icon={['far', isChecked ? 'check-circle' : 'circle']} />
              </button>
              <button
                className={`toolbar-file-state${suite.is_enabled ? ' enabled' : ' disabled'}`}
                title={suite.is_enabled ? 'Деактивировать набор' : 'Активировать набор'}
                onClick={this.handleStateChange}
              >
                <Icon icon={['fas', isCollapsed && showCaret ? 'folder-open' : 'folder']} />
                <Icon icon={['fas', suite.is_enabled ? 'play' : 'pause']} props={{ size: 'sm' }} />
              </button>
            </>
          )}
          <div
            className={`toolbar-file-toggle${isOpened ? ' opened' : ''}${isCollapsed ? ' collapsed' : ''}${
              showCaret ? '' : ' no-pinned'
            }`}
            onClick={({ detail }: any) => this.toggleSuite(detail)}
          >
            {nameIsChanging ? (
              <OutBoundClick className="toolbar-file-title-form" onClick={this.restoreInitialName}>
                <form className="flex" onSubmit={this.handleSubmit}>
                  <input
                    defaultValue={suite.title}
                    autoFocus
                    type="text"
                    className="toolbar-file-name"
                    onChange={this.handleNameChange}
                  />
                  <button
                    type="button"
                    className="toolbar-title-btn toolbar-title-restore"
                    onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                      ev.stopPropagation()
                      this.restoreInitialName()
                    }}
                  >
                    <Icon icon={['fas', 'times']} props={{ size: 'sm' }} />
                  </button>
                  <button
                    type="submit"
                    className="toolbar-title-btn toolbar-title-check"
                    onClick={(ev: React.MouseEvent<HTMLButtonElement>) => ev.stopPropagation()}
                  >
                    <Icon icon={['fas', 'check']} props={{ size: 'sm' }} />
                  </button>
                </form>
              </OutBoundClick>
            ) : (
              <span className="toolbar-file-name" title={suite.title}>
                {suite.title}
              </span>
            )}
            {!nameIsChanging && (
              <>
                <span className="toolbar-file-changed">{suite.updated ? getDate(suite.updated) : 'null'}</span>
                <span className="toolbar-file-count">{suite.stat.templates}</span>
              </>
            )}
          </div>
        </div>
        {templatesPinned && templatesPinned.size > 0 && (
          <ToolbarTemplates
            isCollapsed={isCollapsed}
            suiteId={suite.id}
            templatesPinned={templatesPinned}
            isActiveTab={isActiveTab}
            animationEnabled={animationEnabled}
          />
        )}
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState, ownProps: ToolbarSuiteOwnProps) => ({
  isActiveTab: state.editors.get('activeTab') === ownProps.suite.id,
  isOpened:
    state.editors.getIn(['openedTabs', ownProps.selectedProfile.id]) &&
    state.editors.getIn(['openedTabs', ownProps.selectedProfile.id]).has(ownProps.suite.id),
  isChecked: state.editors.get('selectedSuites').has(ownProps.suite.id),
  isEnabled: state.editors.getIn(['selectedSuites', ownProps.suite.id, 'is_enabled']),
  templatesPinned: state.toolbar.getIn(['templatesPinned', ownProps.suite.id]),
  animationEnabled: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'animationEnabled',
    'value',
  ]),
  whenOpened: state.editors.getIn(['openedTabs', ownProps.selectedProfile.id, ownProps.suite.id, 'opened']),
  dlReadOnly: state.profiles.getIn(['selectedProfile', 'permissions', 'dl_write']) === false,
})

export default connect(mapStateToProps)(withApollo<ToolbarSuiteProps>(ToolbarSuite))
