import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { scrollToTemplate, selectProfile, setActiveTab, setOpenedTabs } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Map } from 'immutable'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { CompilationMessageItem } from '../compilation'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { getProfilesListFromCache } from '../../../utils/queries'
import { goToTemplate } from '../../../utils/editors'

interface CompilationMessageProps {
  item: CompilationMessageItem
  allMessagesOpened: boolean
  client: ApolloClient<NormalizedCacheObject>
  push?(link: string): void
  currentPath: string
  currentUser: Map<any, any>
  selectedProfileId: string
  activeTab: string | null
  openedTabs: Map<any, any>
  selectedAccount: Map<any, any>
}

interface CompilationMessageState {
  isOpened: boolean
  isTemplateOpened: boolean
}

export class CompilationMessage extends PureComponent<CompilationMessageProps, CompilationMessageState> {
  state = {
    isOpened: this.props.allMessagesOpened,
    isTemplateOpened: true,
  }

  toggleOpen = () => this.setState((prevState) => ({ isOpened: !prevState.isOpened }))

  scrollTo = (profileId: string, suiteId: string, templateId: string) => {
    setTimeout(() => {
      if (
        !this.props.openedTabs ||
        !this.props.openedTabs.has(profileId) ||
        !this.props.openedTabs.get(profileId).has(suiteId)
      ) {
        setOpenedTabs(profileId, suiteId, Date.now())
      }
      if (this.props.activeTab !== suiteId) setActiveTab(suiteId)
      if (templateId) scrollToTemplate(templateId)
    }, 500)
  }

  handleScrollToTemplate = (profileId: string, suiteId: string, templateId: string) => {
    if (this.props.selectedProfileId !== profileId && profileId) {
      let profiles: any = getProfilesListFromCache(
        {
          client: this.props.client,
          currentUser: this.props.currentUser,
          selectedAccount: this.props.selectedAccount,
        },
        true
      ).filter((profile: any) => profile.id === profileId)
      if (profiles.size) {
        selectProfile(profiles.first())
      }
    }
    if (this.props.currentPath !== '/' && this.props.currentPath !== '/templates/') {
      this.props.push && this.props.push('/')
    }
    if (suiteId) goToTemplate(templateId, suiteId)
  }

  toggleTemplate = () => this.setState((prevState) => ({ isTemplateOpened: !prevState.isTemplateOpened }))

  componentDidUpdate(prevProps: Readonly<CompilationMessageProps>, prevState: Readonly<CompilationMessageState>) {
    if (prevProps.allMessagesOpened !== this.props.allMessagesOpened) {
      this.setState(() => ({ isOpened: this.props.allMessagesOpened }))
    }
  }

  render() {
    const { item } = this.props
    const { isOpened, isTemplateOpened } = this.state
    return (
      <li className={`compilation-messages-item${isOpened ? ' opened' : ''}`}>
        <div className="compilation-message-header">
          <button
            className={`compilation-message-toggle${!isOpened ? ' truncate' : ''}`}
            title={item.message}
            onClick={this.toggleOpen}
          >
            <Icon icon={['fas', 'caret-right']} />
            {item.status && <span className={`compilation-${item.status}`}>[{item.status}]</span>}
            {item.message}
          </button>
          {(!isOpened || !item.template_meta || !item.template_meta.title) && (
            <button
              className="compilation-message-scroll-btn"
              title="Перейти к шаблону"
              onClick={() => this.handleScrollToTemplate(item.profile_id, item.suite_id, item.template_id)}
            >
              <Icon icon={['fas', 'angle-double-right']} />
            </button>
          )}
        </div>
        {isOpened && (
          <div className="compilation-message-inner">
            {!!item.profile_id && (
              <p>
                <span className="compilation-param">Profile ID:</span>
                <b>{item.profile_id}</b>
              </p>
            )}
            {!!item.suite_id && (
              <p>
                <span className="compilation-param">Suite ID:</span>
                <b>{item.suite_id}</b>
              </p>
            )}
            {!!item.template_id && (
              <p>
                <span className="compilation-param">Template ID:</span>
                <b>{item.template_id}</b>
              </p>
            )}
            {!!item.template_meta && !!item.template_meta.last_user && !!item.template_meta.last_user.name && (
              <p>
                <span className="compilation-param">Последнее изменение:</span>
                <b>{item.template_meta.last_user.name}</b>
              </p>
            )}
            <div className="compilation-template">
              {!!item.template_meta && !!item.template_meta.title && (
                <div
                  className={`compilation-template-title${isTemplateOpened ? ' opened' : ''}`}
                  onClick={this.toggleTemplate}
                >
                  <Icon icon={['fas', 'caret-right']} />
                  <span>{item.template_meta.title}</span>
                  <button
                    className="compilation-message-scroll-btn"
                    title="Перейти к шаблону"
                    onClick={() => this.handleScrollToTemplate(item.profile_id, item.suite_id, item.template_id)}
                  >
                    <Icon icon={['fas', 'angle-double-right']} />
                  </button>
                </div>
              )}
              {!!item.near_text && isTemplateOpened && (
                <div className="compilation-template-text">{item.near_text}</div>
              )}
            </div>
          </div>
        )}
      </li>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
  currentUser: state.auth.get('user'),
  selectedProfileId: state.profiles.get('selectedProfile').id,
  activeTab: state.editors.get('activeTab'),
  openedTabs: state.editors.get('openedTabs'),
  selectedAccount: state.profiles.get('selectedAccount'),
})

export default connect(mapStateToProps, { push })(withApollo<CompilationMessageProps>(CompilationMessage))
