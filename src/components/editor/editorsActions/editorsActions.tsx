import React, { PureComponent } from 'react'
import { editorActions } from '../../../routes/configs/editorsConfig'
import Icon from '../../common/icon'
import { Mutation } from 'react-apollo'
import { setPinnedTemplates, setCustomConfirmConfig } from '../../../store/dispatcher'
import {
  TEMPLATE_CREATE_MUTATION,
  TEMPLATE_REMOVE_MUTATION,
  TEMPLATE_UPDATE_MUTATION,
} from '../../../graphql/queries/templatesQuery'
import { PureQueryOptions } from 'apollo-client'
import { Map } from 'immutable'
import { TemplateItem } from '../editors'
import { DataProxy } from 'apollo-cache'
import { getSuitesRefetchData, getTemplatesRefetchData } from '../../../utils/queries'
import { RandomObject } from '../../../@types/common'
import { notifyWithDelay } from '../../../utils/common'
import CustomConfirm from '../../common/customConfirm'
import { Editor } from 'draft-js'

interface EditorsActionsProps {
  forwardedRef: React.RefObject<HTMLButtonElement>
  text: string
  selectedProfileId: string
  suiteId: string
  template: TemplateItem
  description: string
  isPinned: boolean
  saved: boolean
  showFullscreen: boolean
  editorRef: React.RefObject<Editor>
  containerRef: React.RefObject<HTMLDivElement>
  currentUser: Map<any, any>
  positionSortingEnabled: boolean
  sortingDirectionIsAsc: boolean
  stateHandlers: {
    discardHandler(): void
    saveHandler(mutation: () => void): void
  }
}

export class EditorsActions extends PureComponent<EditorsActionsProps> {
  selectMutation = (action: string) => {
    let data: {
      mutation: any
      vars?: RandomObject
      refetch?: PureQueryOptions[]
      callback?: (data?: RandomObject) => void
      update?: (proxy: DataProxy, data: RandomObject) => void
    } = {
      mutation: {},
    }

    switch (action) {
      case 'state':
        data.mutation = TEMPLATE_UPDATE_MUTATION
        data.vars = {
          params: {
            id: this.props.template.id,
            is_enabled: !this.props.template.is_enabled,
            meta: {
              title: this.props.template.meta.title,
              description: this.props.template.meta.description,
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            },
          },
        }
        data.refetch = getTemplatesRefetchData(this.props.suiteId)
        data.callback = () => {
          if (this.props.isPinned) {
            const newTemplate = Object.assign({}, this.props.template)
            newTemplate.is_enabled = !newTemplate.is_enabled
            setPinnedTemplates(this.props.suiteId, this.props.template.id, newTemplate)
          }
        }
        break
      case 'createAfter':
        data.mutation = TEMPLATE_CREATE_MUTATION
        data.vars = {
          params: {
            suite_id: this.props.suiteId,
            content: '<div><br></div>',
            position_before:
              this.props.positionSortingEnabled && !this.props.sortingDirectionIsAsc ? this.props.template.id : null,
            position_after:
              this.props.positionSortingEnabled && this.props.sortingDirectionIsAsc ? this.props.template.id : null,
            meta: {
              title: '',
              description: '',
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            },
          },
        }
        data.refetch = getSuitesRefetchData(this.props.selectedProfileId).concat(
          getTemplatesRefetchData(this.props.suiteId)
        )
        break
      case 'copy':
        data.mutation = TEMPLATE_CREATE_MUTATION
        data.vars = {
          params: {
            suite_id: this.props.suiteId,
            content: this.props.text,
            position_before:
              this.props.positionSortingEnabled && !this.props.sortingDirectionIsAsc ? this.props.template.id : null,
            position_after:
              this.props.positionSortingEnabled && this.props.sortingDirectionIsAsc ? this.props.template.id : null,
            meta: {
              title: this.props.template.meta.title ? `${this.props.template.meta.title} (копия)` : '(копия)',
              description: this.props.description || this.props.template.meta.description || '',
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            },
          },
        }
        data.refetch = getSuitesRefetchData(this.props.selectedProfileId).concat(
          getTemplatesRefetchData(this.props.suiteId)
        )
        break
      case 'remove':
        data.mutation = TEMPLATE_REMOVE_MUTATION
        data.vars = { id: this.props.template.id }
        data.refetch = getSuitesRefetchData(this.props.selectedProfileId).concat(
          getTemplatesRefetchData(this.props.suiteId)
        )
        data.callback = () => {
          if (this.props.isPinned) setPinnedTemplates(this.props.suiteId, this.props.template.id, null)
          notifyWithDelay({ msg: 'Шаблон успешно удалён!', hideAfter: 2000 })
        }
        break
      case 'save':
        data.mutation = TEMPLATE_UPDATE_MUTATION
        data.refetch = getTemplatesRefetchData(this.props.suiteId)
        break
      default:
        return false
    }

    return data
  }

  handleState = (mutation: () => void) => mutation()

  handleCreateAfter = (mutation: () => void) => mutation()

  handleCopy = (mutation: () => void) => mutation()

  handleRemove = (mutation: () => void, action: string) => {
    setCustomConfirmConfig({
      active: true,
      activeName: `confirm-${action}-${this.props.template.id}`,
      onConfirm: mutation,
      title: 'Удалить шаблон',
    })
  }

  handleDiscard = (action: string) => {
    if (!this.props.saved && this.props.editorRef.current) {
      setCustomConfirmConfig({
        active: true,
        activeName: `confirm-${action}-${this.props.template.id}`,
        onConfirm: () => {
          this.props.stateHandlers.discardHandler()
          notifyWithDelay({
            msg: 'Последнее сохранённое состояние восстановлено!',
            hideAfter: 2000
          })
        },
        title: 'Востановить последнее сохранненое состояние',
      })
    }
  }

  handleSave = (mutation: () => void) => {
    if (!this.props.saved && this.props.editorRef.current) {
      this.props.stateHandlers.saveHandler(mutation)
    }
  }

  handleAction = (action: string, mutation?: () => void) => {
    switch (action) {
      case 'state':
        if (mutation) this.handleState(mutation)
        break
      case 'createAfter':
        if (mutation) this.handleCreateAfter(mutation)
        break
      case 'copy':
        if (mutation) this.handleCopy(mutation)
        break
      case 'remove':
        if (mutation) this.handleRemove(mutation, action)
        break
      case 'discard':
        this.handleDiscard(action)
        break
      case 'save':
        if (mutation) this.handleSave(mutation)
        break
      default:
        break
    }
  }

  render() {
    const { forwardedRef, saved, positionSortingEnabled } = this.props
    return (
      <div className="editorActions">
        {editorActions.map((el, index) => {
          const data = this.selectMutation(el.name)
          const ref = el.name === 'save' ? forwardedRef : null
          if ((el.name === 'discard' || el.name === 'save') && saved) return null
          if (el.name === 'createAfter' && !positionSortingEnabled) return null
          return (
            <div
              key={`${index}-${el.name}-${this.props.template.id}`}
              className="editorActionsBtnWrapper"
            >
              {data ? (
                <Mutation
                  key={`${index}-${el.name}`}
                  mutation={data.mutation}
                  variables={data.vars || {}}
                  refetchQueries={() => data.refetch || ['']}
                  onCompleted={typeof data.callback === 'function' ? data.callback : () => {}}
                  update={typeof data.update === 'function' ? data.update : () => {}}
                >
                  {(postMutation: () => void) => (
                    <button
                      className={`editorActionsBtn ${el.name}`}
                      onClick={() => this.handleAction(el.name, postMutation)}
                      title={el.title}
                      ref={ref}
                    >
                      <Icon icon={el.icon} props={{ size: 'lg' }} />
                    </button>
                  )}
                </Mutation>
              ) : (
                <button
                  className={`editorActionsBtn ${el.name}`}
                  onClick={() => this.handleAction(el.name)}
                  title={el.title}
                >
                  <Icon icon={el.icon} props={{ size: 'lg' }} />
                </button>
              )}
              {(el.name === 'discard' || el.name === 'remove') && (
                <CustomConfirm
                  name={`confirm-${el.name}-${this.props.template.id}`}
                  style={{ left: 'calc(50% - 40px)', bottom: '40px' }}
                  theme="dark"
                  isFrom="bottom"
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

export default EditorsActions
