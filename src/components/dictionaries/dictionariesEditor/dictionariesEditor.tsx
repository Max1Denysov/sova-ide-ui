import React, { PureComponent } from 'react'
import Icon from '../../common/icon'

import {
  setOpenedDictionaries,
  closeDictionary,
  setCustomConfirmConfig,
} from '../../../store/dispatcher'
import { InView } from 'react-intersection-observer'
import {
  DICTIONARY_FETCH_QUERY,
  DICTIONARY_REMOVE_MUTATION,
  DICTIONARY_CREATE_MUTATION,
  DICTIONARY_UPDATE_MUTATION,
} from '../../../graphql/queries/dictionariesQueries'
import DictionariesActions from '../dictionariesActions/dictionariesActions'
import { PureQueryOptions } from 'apollo-client'
import ScrollbarCustom from '../../common/customScrollbar'
import Scrollbars from 'react-scrollbars-custom'
import { Map } from 'immutable'
import { notifyWithDelay } from '../../../utils/common'
import { BaseMutationOptions } from 'react-apollo'
import { getDictsRefetchData } from '../../../utils/queries'
import { Editor, EditorState, ContentBlock, DraftHandleValue, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import { prepareText } from '../../editor/basicEditor/basicEditor'

const { hasCommandModifier } = KeyBindingUtil

interface DictionaryEditorProps {
  id: string
  code: string
  description: string
  common: boolean
  content: string
  updated: number
  selectedProfileId: string
  profile_ids: string[]
  lastUser: {
    uuid: string
    name: string
    username: string
    user_role: string
  } | null
  currentUser: Map<any, any>
  isEditorsPage?: boolean
  dictAnimationFinish?: boolean
  isEnabled: boolean
  showLinesCount: boolean
  showDescription: boolean
}

interface DictionariesEditorState {
  text: string
  focused: boolean
  saved: boolean
  linesCount: number
  showLines: boolean
  description: string
  editorState: EditorState
}

class DictionariesEditor extends PureComponent<DictionaryEditorProps, DictionariesEditorState> {
  state = {
    text: prepareText(this.props.content),
    focused: false,
    saved: true,
    linesCount: 1,
    showLines: this.props.showLinesCount,
    description: this.props.description || '',
    editorState: EditorState.createWithContent(prepareText(this.props.content)),
  }

  editor = React.createRef<any>()
  editorContainer = React.createRef<HTMLDivElement>()
  scrollbar = React.createRef<Scrollbars>()
  saveButton = React.createRef<HTMLButtonElement>()

  countLines = () => {
    if (this.editorContainer.current) {
      this.editorContainer.current.querySelectorAll('.nlab-logic-editor-line').forEach((node, index) => {
        if (node && (node as HTMLElement).dataset.line !== `${index + 1}`) {
          ;(node as HTMLElement).dataset.line = `${index + 1}`
        }
      })
    }
  }

  toggleLines = () => {
    this.setState(
      (prevState) => ({ showLines: !prevState.showLines }),
      () => this.state.showLines && this.countLines()
    )
  }

  handleFirstLine = () => {
    if (this.editor.current && (this.editor.current.innerHTML === '' || this.editor.current.innerHTML === `<br>`)) {
      this.editor.current.innerHTML = `<div><br></div>`
    }
  }

  handleCtrlS = (ev: React.KeyboardEvent) => {
    if (ev.ctrlKey && ev.keyCode === 'S'.charCodeAt(0)) {
      ev.preventDefault()
      this.setState(
        () => ({ saved: false }),
        () => {
          this.editor.current!.blur()
          setTimeout(() => this.saveButton.current!.click(), 100)
        }
      )
    }
  }

  handleFocus = () => {
    if (this.editor.current) {
      this.setState(
        () => ({
          focused: true,
        }),
        this.countLines
      )

      this.editor.current.focus()
    }
  }

  handleKeyDown = (ev: React.KeyboardEvent) => {
    ev.persist()
    if (!this.state.saved) this.handleCtrlS(ev)
  }

  discardChanges = () => {
    this.setState(() => ({
      editorState: EditorState.createWithContent(prepareText(this.props.content)),
      description: this.props.description || '',
      saved: true,
    }))
  }

  copyDictionary = (id: string | null) => {
    id && setOpenedDictionaries(id, Date.now())
  }

  selectMutation = (action: string) => {
    let data: {
      mutation: any
      vars?: {}
      refetch?: PureQueryOptions[]
      callback?: (id: string | null) => void
      removeAsk?: () => void
    } = {
      mutation: {},
    }

    let dictQueries = getDictsRefetchData(this.props.selectedProfileId)

    switch (action) {
      case 'state':
        data.mutation = DICTIONARY_UPDATE_MUTATION
        data.vars = {
          params: {
            id: this.props.id,
            is_enabled: !this.props.isEnabled,
            meta: {
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            },
          },
        }
        data.refetch = dictQueries.concat([{ query: DICTIONARY_FETCH_QUERY, variables: { id: this.props.id } }])
        break
      case 'save':
        data.mutation = DICTIONARY_UPDATE_MUTATION
        data.refetch = [{ query: DICTIONARY_FETCH_QUERY, variables: { id: this.props.id } }]
        break
      case 'copy':
        data.mutation = DICTIONARY_CREATE_MUTATION
        data.vars = {
          params: {
            code: `${this.props.code} (Копия)`,
            content: this.state.text,
            description: this.state.description,
            common: this.props.common,
            profile_ids: this.props.profile_ids,
            meta: {
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            },
          },
        }
        data.refetch = dictQueries
        data.callback = this.copyDictionary
        break
      case 'remove':
        data.mutation = DICTIONARY_REMOVE_MUTATION
        data.vars = { id: this.props.id }
        data.refetch = dictQueries
        data.callback = () => {
          closeDictionary(this.props.id)
          notifyWithDelay({ msg: 'Словарь успешно удалён!', hideAfter: 2000 })
        }
        break
      default:
        return false
    }

    return data
  }

  handleState = (mutation: () => void) => mutation()

  handleCopy = (mutation: () => void) => mutation()

  handleRemove = (mutation: () => void, action: string) => {
    setCustomConfirmConfig({
      active: true,
      activeName: `confirm-${action}-${this.props.updated}`,
      onConfirm: mutation,
      title: 'Удалить словарь',
    })
  }

  handleDiscard = (action: string) => {
    if (!this.state.saved && this.editor.current) {
      setCustomConfirmConfig({
        active: true,
        activeName: `confirm-${action}-${this.props.updated}`,
        onConfirm: () => {
          this.discardChanges()
          notifyWithDelay({
            msg: 'Последнее сохранённое состояние восстановлено!',
            hideAfter: 2000
          })
        },
        title: 'Востановить последнее сохранненое состояние',
      })
    }
  }

  handleSave = (mutation: (options?: BaseMutationOptions) => void) => {
    if (!this.state.saved) {
      const text = this.prepareTextForSaving()

      this.setState(
        () => ({
          text: text,
          saved: true,
        }),
        () =>
          mutation({
            variables: {
              params: {
                id: this.props.id,
                content: text,
                description: this.state.description,
                meta: {
                  last_user: {
                    uuid: this.props.currentUser.get('uuid'),
                    name: this.props.currentUser.get('name') || '',
                    username: this.props.currentUser.get('username'),
                    user_role: this.props.currentUser.getIn(['role', 'type']),
                  },
                },
              },
            },
          })
      )
    }
  }

  handleAction = (action: string, mutation?: () => void) => {
    switch (action) {
      case 'state':
        if (mutation) this.handleState(mutation)
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

  handleDescriptionChange = (value: string) => {
    if (this.state.saved) {
      this.setState(() => ({
        description: value,
        saved: this.props.description === null ? value === '' : value === this.props.description,
      }))
    } else {
      this.setState(() => ({ description: value }))
    }
  }

  /** DraftJS **/

  prepareTextForSaving = () => {
    const contentState = this.state.editorState.getCurrentContent()
    const text = contentState.getPlainText('<div><br/></div> ')

    return text
  }

  handlEditorChange = (editorState: EditorState) => {
    this.setState(() => ({
      editorState,
      saved:
        editorState.getCurrentContent().getPlainText() ===
        EditorState.createWithContent(prepareText(this.props.content)).getCurrentContent().getPlainText(),
    }))
  }

  blockCustomizations = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType()

    if (type === 'unstyled') {
      return 'nlab-logic-editor-line'
    }

    return 'nlab-logic-editor-default-block'
  }

  editorKeyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
      this.saveButton.current?.click()
      return 'save-template'
    }
    return getDefaultKeyBinding(e)
  }

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'save-template') {
      return 'handled'
    }
    return 'not-handled'
  }

  /** DraftJS - END **/

  componentDidMount() {
    this.countLines()
  }

  componentDidUpdate(prevProps: Readonly<DictionaryEditorProps>, prevState: Readonly<DictionariesEditorState>) {
    if (prevProps.dictAnimationFinish !== this.props.dictAnimationFinish && this.props.dictAnimationFinish) {
      this.handleFocus()
    }

    if (this.state.showLines && this.editorContainer.current) {
      const randomLine = this.editorContainer.current.querySelector('.nlab-logic-editor-line')
      if (
        prevState.editorState !== this.state.editorState ||
        (randomLine && !(randomLine as HTMLElement).dataset.line)
      ) {
        this.countLines()
      }
    }
  }

  render() {
    const { focused, showLines, saved, description } = this.state
    const { id, updated, lastUser, showDescription } = this.props
    return (
      <InView>
        {({ inView, ref }) => (
          <div className={`editorItem in-view-${inView}`} ref={ref}>
            <div
              ref={this.editorContainer}
              className={`editor active editor_dict${focused ? ' focused' : ''}${!showLines ? ' no-lines' : ''}${
                !saved ? ' not-saved' : ''
              }`}
            >
              {inView && (
                <>
                  <div className="editorContent">
                    <div className={`editorDescription${showDescription ? ' active' : ''}`}>
                      <div className="editorDescription-id">
                        ID: <span>{id}</span>
                      </div>
                      <textarea
                        name="editorDescription"
                        value={description}
                        placeholder={!description ? '(описание отсутствует)' : ''}
                        onChange={({ target: { value } }) => this.handleDescriptionChange(value)}
                        onKeyDown={this.handleKeyDown}
                      />
                    </div>
                    <button
                      className={`editorLinesBtn${showLines ? ' active' : ''}`}
                      onClick={this.toggleLines}
                      title={`${showLines ? 'Скрыть' : 'Показать'} нумерацию строк`}
                    >
                      <Icon icon={['far', showLines ? 'eye-slash' : 'eye']} props={{ size: 'sm' }} />
                    </button>
                    <ScrollbarCustom
                      className="editorInner"
                      innerRef={this.scrollbar}
                      noScrollX={false}
                      translateContentSizeYToHolder={true}
                    >
                      <div className="editorTextarea-wrapper">
                        <Editor
                          ref={this.editor}
                          editorState={this.state.editorState}
                          onChange={this.handlEditorChange}
                          stripPastedStyles={true}
                          blockStyleFn={this.blockCustomizations}
                          handleKeyCommand={this.handleKeyCommand}
                          keyBindingFn={this.editorKeyBindingFn}
                        />
                      </div>
                    </ScrollbarCustom>
                    <DictionariesActions
                      forwardedRef={this.saveButton}
                      saved={saved}
                      handleAction={this.handleAction}
                      selectMutation={this.selectMutation}
                      lastUpdated={updated}
                      lastUser={lastUser}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </InView>
    )
  }
}

export default DictionariesEditor
