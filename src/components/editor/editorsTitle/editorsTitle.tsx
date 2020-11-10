import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { TEMPLATE_UPDATE_MUTATION, TEMPLATES_QUERY } from '../../../graphql/queries/templatesQuery'
import { Mutation } from 'react-apollo'
import { setPinnedTemplates } from '../../../store/dispatcher'
import { Map } from 'immutable'
import { TemplateItem } from '../editors'
import { getSuitesRefetchData } from '../../../utils/queries'

interface EditorsTitleProps {
  selectedProfileId: string
  suiteId: string
  template: TemplateItem
  showFullscreen: boolean
  handleOpen(): void
  isPinned: boolean
  currentUser: Map<any, any>
  dlReadOnly: boolean
}

interface EditorsTitleState {
  allowEditTitle: boolean
  newTitle: string
}

class EditorsTitle extends PureComponent<EditorsTitleProps, EditorsTitleState> {
  state = {
    allowEditTitle: false,
    newTitle: this.props.template.meta.title || '',
  }

  titleRef = React.createRef<HTMLInputElement>()

  titleMutateFunc = () => {}

  handleTitleEdit = (shouldSave?: boolean) => {
    if (this.props.dlReadOnly) return
    this.setState(
      prevState => ({
        allowEditTitle: !prevState.allowEditTitle,
        newTitle: shouldSave ? this.state.newTitle : this.props.template.meta.title || '',
      }),
      () => {
        if (this.titleRef.current) {
          if (this.state.allowEditTitle) {
            this.titleRef.current.focus()
          } else {
            this.titleRef.current.blur()
          }
        }
      }
    )
  }

  handleTitleChange = (value: string) => this.setState(() => ({ newTitle: value }))

  handleConfirm = () => {
    if (this.props.dlReadOnly) return
    if (this.state.newTitle && this.props.template.meta.title !== this.state.newTitle) {
      if (this.props.isPinned) {
        const newTemplate = Object.assign({}, this.props.template)
        newTemplate.meta.title = this.state.newTitle
        setPinnedTemplates(this.props.suiteId, this.props.template.id, newTemplate)
      }
      if (typeof this.titleMutateFunc === 'function') this.titleMutateFunc()
    } else {
      this.handleTitleEdit()
    }
  }

  handleKeyDown = (key: string) => {
    if (key === 'Enter') this.handleConfirm()
    if (key === 'Escape') this.handleTitleEdit()
  }

  render() {
    const {
      selectedProfileId,
      suiteId,
      template,
      showFullscreen,
      handleOpen,
      currentUser,
      dlReadOnly,
    } = this.props
    const { allowEditTitle, newTitle } = this.state
    return (
      <div className="editorHeader-title">
        <button
          className="editorHeader-toggle"
          onClick={() => {
            if (!showFullscreen) handleOpen()
          }}
        />
        <button
          onClick={() => {
            if (!showFullscreen) handleOpen()
          }}
          className="editorHeader-caret"
        >
          <Icon icon={['fas', 'caret-right']} />
        </button>
        {allowEditTitle ? (
          <input
            ref={this.titleRef}
            className={`editorHeader-input${allowEditTitle ? ' active' : ''}`}
            type="text"
            value={newTitle !== template.meta.title ? newTitle : template.meta.title || ''}
            placeholder={!template.meta.title ? '(без названия)' : ''}
            onChange={({ currentTarget: { value } }) => this.handleTitleChange(value)}
            onKeyDown={({ key }) => this.handleKeyDown(key)}
          />
        ) : (
          <span
            className={`editorHeader-span${!dlReadOnly ? ' clickable' : ''}`}
            dangerouslySetInnerHTML={{
              __html: template.meta.title || '(без названия)',
            }}
            title={template.meta.title || '(без названия)'}
            onClick={() => !dlReadOnly && this.handleTitleEdit()}
          />
        )}
        {!dlReadOnly && (
          <button
            className={`editorHeader-edit${allowEditTitle ? ' active' : ''}`}
            onClick={() => this.handleTitleEdit()}
          >
            <Icon icon={['fas', 'pen']} props={{ size: 'sm' }}/>
          </button>
        )}
        {allowEditTitle && (
          <>
            <button className="editorHeader-action action-cancel" onClick={() => this.handleTitleEdit()}>
              <Icon icon={['fas', 'times']} props={{ size: 'sm' }} />
            </button>
            <Mutation
              mutation={TEMPLATE_UPDATE_MUTATION}
              variables={{
                params: {
                  id: template.id,
                  meta: {
                    title: newTitle,
                    description: template.meta.description || '',
                    last_user: {
                      uuid: currentUser.get('uuid'),
                      name: currentUser.get('name') || '',
                      username: currentUser.get('username'),
                      user_role: currentUser.getIn(['role', 'type']),
                    },
                  }
                }
              }}
              refetchQueries={() => getSuitesRefetchData(selectedProfileId).concat([
                { query: TEMPLATES_QUERY, variables: { suite_id: suiteId } }
              ])}
              onCompleted={() => this.handleTitleEdit(true)}
            >
              {(postMutation: () => void) => {
                this.titleMutateFunc = postMutation
                return (
                  <button
                    className="editorHeader-action"
                    onClick={() => this.handleConfirm()}
                  >
                    <Icon icon={['fas', 'check']} props={{ size: 'sm' }} />
                  </button>
                )
              }}
            </Mutation>
          </>
        )}
      </div>
    )
  }
}

export default EditorsTitle
