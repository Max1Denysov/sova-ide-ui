import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { selectProfile, setPinnedTemplates } from '../../../store/dispatcher'
import { withApollo } from 'react-apollo'
import { TemplateItem } from '../editors'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { TEMPLATE_UPDATE_MUTATION } from '../../../graphql/queries/templatesQuery'
import { getProfilesListFromCache, getTemplatesRefetchData } from '../../../utils/queries'
import { Map } from 'immutable'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { goToTemplate } from '../../../utils/editors'

interface FullscreenElement extends Element {
  webkitRequestFullscreen?(): void
  mozRequestFullScreen?(): void
  msRequestFullscreen?(): void
}

interface EditorsSettingsProps {
  client: ApolloClient<NormalizedCacheObject>
  selectedProfile: ProfileItem
  suiteId: string
  template: TemplateItem
  showFullscreen: boolean
  isOpened: boolean
  isPinned: boolean
  showDescription: boolean
  positionSortingEnabled: boolean
  sortingDirectionIsAsc: boolean
  handleOpen(): void
  toggleDescription(): void
  position: {
    isFirst: boolean
    isLast: boolean
  }
  siblings: {
    prev?: TemplateItem
    next?: TemplateItem
  }
  currentUser: Map<any, any>
  selectedAccount: Map<any, any>
}

export class EditorsSettings extends PureComponent<EditorsSettingsProps> {
  expandFullscreen = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const editor = ev.currentTarget.closest('.editor_basic') as FullscreenElement
    if (editor) {
      if (editor.requestFullscreen) {
        editor.requestFullscreen()
      } else if (editor.webkitRequestFullscreen) {
        editor.webkitRequestFullscreen()
      } else if (editor.mozRequestFullScreen) {
        editor.mozRequestFullScreen()
      } else if (editor.msRequestFullscreen) {
        editor.msRequestFullscreen()
      }
    }
  }

  exitFullscreen = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.showFullscreen) {
      const editor = ev.currentTarget.closest('.editor_basic') as FullscreenElement
      if (editor) {
        // @ts-ignore
        if (editor.requestFullscreen) {
          document.exitFullscreen()
        } else if (editor.webkitRequestFullscreen) {
          // @ts-ignore
          document.webkitExitFullscreen()
        } else if (editor.mozRequestFullScreen) {
          // @ts-ignore
          document.mozCancelFullScreen()
        } else if (editor.msRequestFullscreen) {
          // @ts-ignore
          document.msExitFullscreen()
        }
      }
    }
  }

  handlePin = () => {
    setPinnedTemplates(this.props.suiteId, this.props.template.id, this.props.isPinned ? null : this.props.template)
  }

  moveTemplate = async (shouldMoveUp: boolean) => {
    if (this.props.client) {
      await this.props.client.mutate({
        mutation: TEMPLATE_UPDATE_MUTATION,
        variables: this.props.sortingDirectionIsAsc
          ? shouldMoveUp
            ? {
                params: {
                  id: this.props.template.id,
                  position_before: this.props.siblings.prev ? this.props.siblings.prev.id : null,
                },
              }
            : {
                params: {
                  id: this.props.template.id,
                  position_after: this.props.siblings.next ? this.props.siblings.next.id : null,
                },
              }
          : shouldMoveUp
          ? {
              params: {
                id: this.props.template.id,
                position_after: this.props.siblings.prev ? this.props.siblings.prev.id : null,
              },
            }
          : {
              params: {
                id: this.props.template.id,
                position_before: this.props.siblings.next ? this.props.siblings.next.id : null,
              },
            },
        refetchQueries: () => getTemplatesRefetchData(this.props.suiteId),
      })
    }
  }

  scrollToTemplate = () => {
    if (this.props.selectedProfile.id !== this.props.template.profile_id && this.props.template.profile_id) {
      let profiles: any = getProfilesListFromCache(
        {
          client: this.props.client,
          currentUser: this.props.currentUser,
          selectedAccount: this.props.selectedAccount,
        },
        true
      ).filter((profile: any) => profile.id === this.props.template.profile_id)
      if (profiles.size) {
        selectProfile(profiles.first())
      }
    }
    if (this.props.template.suite_id) {
      goToTemplate(this.props.template.id, this.props.template.suite_id, this.props.template.suite_title)
    }
  }

  componentDidUpdate(prevProps: Readonly<EditorsSettingsProps>) {
    if (prevProps.showFullscreen !== this.props.showFullscreen && this.props.showFullscreen && !this.props.isOpened) {
      this.props.handleOpen()
    }
  }

  render() {
    const {
      showFullscreen,
      isOpened,
      isPinned,
      showDescription,
      toggleDescription,
      positionSortingEnabled,
      position: { isFirst, isLast },
    } = this.props
    return (
      <div className="editorHeader-settings">
        {isOpened && (
          <button
            className="editorHeader-btn btn-desc"
            onClick={toggleDescription}
            title={`${showDescription ? 'Скрыть' : 'Показать'} описание шаблона`}
          >
            <Icon icon={['fas', 'align-left']} />
          </button>
        )}
        {!showFullscreen ? (
          <>
            <button
              className={`editorHeader-btn btn-pin${isPinned ? ' pinned' : ''}`}
              onClick={this.handlePin}
              title={`${isPinned ? 'Удалить из избранных шаблонов' : 'Добавить к избранным шаблонам'}`}
            >
              <Icon icon={['fas', 'thumbtack']} />
            </button>
            <button
              className="editorHeader-btn btn-full"
              onClick={(ev) => this.expandFullscreen(ev)}
              title="Полноэкранный режим"
            >
              <Icon icon={['fas', 'expand-arrows-alt']} />
            </button>
            {positionSortingEnabled && (
              <div className="editorHeader-position">
                <button
                  className={`editorHeader-moveBtn${isFirst ? ' disabled' : ''}`}
                  title={isFirst ? '' : 'Переместить шаблон выше'}
                  onClick={() => !isFirst && this.moveTemplate(true)}
                >
                  <Icon icon={['fas', 'angle-up']} />
                </button>
                <button
                  className={`editorHeader-moveBtn${isLast ? ' disabled' : ''}`}
                  title={isLast ? '' : 'Переместить шаблон ниже'}
                  onClick={() => !isLast && this.moveTemplate(false)}
                >
                  <Icon icon={['fas', 'angle-down']} />
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            className="editorHeader-btn btn-full"
            onClick={(ev) => this.exitFullscreen(ev)}
            title="Выйти из полноэкранного режима"
          >
            <Icon icon={['fas', 'compress-arrows-alt']} />
          </button>
        )}
      </div>
    )
  }
}

export default withApollo<EditorsSettingsProps>(EditorsSettings)
