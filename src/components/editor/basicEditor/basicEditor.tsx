import React, { PureComponent } from 'react'
import { Map } from 'immutable'
import { InView } from 'react-intersection-observer'
import { connect } from 'react-redux'
import Icon from '../../common/icon'
import { scrollToTemplate } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import EditorsTitle from '../editorsTitle/editorsTitle'
import EditorsSettings from '../editorsSettings/editorsSettings'
import EditorsActions from '../editorsActions/editorsActions'
import EditorsUpdates from '../editorsUpdates/editorsUpdates'
import Scrollbars from 'react-scrollbars-custom'
import { TemplateItem } from '../editors'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { BaseMutationOptions } from 'react-apollo'
import { Editor, EditorState, ContentState, convertFromHTML, ContentBlock, DraftHandleValue } from 'draft-js'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import ScrollbarCustom from '../../common/customScrollbar'
import { repeatIfFalse } from '../../../utils/common'
const { hasCommandModifier } = KeyBindingUtil

type BasicEditorOwnProps = {
  template: TemplateItem
  suiteId: string
  currentUser: Map<any, any>
  animationEnabled: boolean
  editorsOpened: boolean
  textEditor: string
  selectedProfile: ProfileItem
  root: Scrollbars | null
  position: {
    isFirst: boolean
    isLast: boolean
  }
  siblings: {
    prev?: TemplateItem
    next?: TemplateItem
  }
}

interface BasicEditorProps {
  template: TemplateItem
  suiteId: string
  showFullscreen: boolean
  isPinned: boolean
  scrollTo: boolean
  currentUser: Map<any, any>
  animationEnabled: boolean
  editorsOpened: boolean
  textEditor: string
  favTemplatesExpanded: boolean
  selectedProfile: ProfileItem
  root: Scrollbars | null
  position: {
    isFirst: boolean
    isLast: boolean
  }
  siblings: {
    prev?: TemplateItem
    next?: TemplateItem
  }
  dlReadOnly: boolean
  showLinesCount: boolean
  editorsSorting: Map<any, any>
  selectedAccount: Map<any, any>
}

interface BasicEditorState {
  isOpened: boolean
  text: string
  focused: boolean
  saved: boolean
  showLines: boolean
  showDescription: boolean
  description: string
  timestamp: Date
  editorState: EditorState
}

export const prepareText: any = (text: string) => {
  const escapeHtmlDict = (string: string) => {
    return string.replace(/<dict/g, '&lt;dict')
  }

  const blocksFromHTML = convertFromHTML(escapeHtmlDict(text))

  const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)

  return state
}

export class BasicEditor extends PureComponent<BasicEditorProps, BasicEditorState> {
  state = {
    timestamp: new Date(),
    isOpened: this.props.favTemplatesExpanded && this.props.isPinned ? true : this.props.editorsOpened,
    text: prepareText(this.props.textEditor),
    focused: false,
    saved: true,
    showLines: this.props.showLinesCount,
    status: this.props.template,
    showDescription: false,
    description: this.props.template.meta.description || '',
    editorState: EditorState.createWithContent(prepareText(this.props.textEditor)),
  }

  editor = React.createRef<Editor>()
  editorContainer = React.createRef<HTMLDivElement>()
  editorTools = React.createRef<HTMLDivElement>()
  scrollbar = React.createRef<Scrollbars>()
  saveButton = React.createRef<HTMLButtonElement>()

  handleOpen = () => {
    this.setState(
      (prevState) => ({
        isOpened: !prevState.isOpened,
        focused: false,
        showDescription: false,
      }),
      () => {
        if (this.state.isOpened) this.scrollToOpened()
      }
    )
  }

  handleScrollTo = () => {
    if (this.props.scrollTo) {
      if (!this.state.isOpened) {
        this.handleOpen()
      } else {
        this.scrollToOpened()
        repeatIfFalse(() => {
          if (!this.editorContainer.current || !this.editor.current) return false
          this.editorContainer.current!.scrollIntoView({ behavior: 'auto' })
          this.editor.current.focus()
          return true
        }, 500)
      }
    }
  }

  scrollToOpened = () => {
    if (this.editorContainer.current && this.state.isOpened) {
      window.dispatchEvent(new Event('resize'))
      this.editorContainer.current.scrollIntoView({ behavior: this.props.animationEnabled ? 'smooth' : 'auto' })
      if (this.props.scrollTo) scrollToTemplate(null)
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

  checkStatus = () => {
    return this.props.template.is_enabled ? 'showOk' : 'showAttention'
  }

  handleDescriptionChange = (value: string) => {
    if (this.props.dlReadOnly) return
    if (this.state.saved) {
      this.setState(() => ({
        description: value,
        saved:
          this.props.template.meta.description === null ? value === '' : value === this.props.template.meta.description,
      }))
    } else {
      this.setState(() => ({ description: value }))
    }
  }

  toggleDescription = () => this.setState((prevState) => ({ showDescription: !prevState.showDescription }))

  scrollToBottom = () => {
    if (this.editorTools.current) {
      this.editorTools.current.scrollIntoView({
        behavior: this.props.animationEnabled ? 'smooth' : 'auto',
        block: 'center',
      })
    }
  }

  scrollToTop = () => {
    if (this.editorContainer.current) {
      this.editorContainer.current.scrollIntoView({ behavior: this.props.animationEnabled ? 'smooth' : 'auto' })
    }
  }

  discardHandler = () => {
    this.setState(() => ({
      editorState: EditorState.createWithContent(prepareText(this.props.textEditor)),
      description: this.props.template.meta.description || '',
      saved: true,
    }))
  }

  saveHandler = (mutation: (options?: BaseMutationOptions) => void) => {
    const text = this.prepareTextForSaving()

    this.setState(
      () => ({
        saved: true,
      }),
      () =>
        mutation({
          variables: {
            params: {
              id: this.props.template.id,
              content: text,
              meta: {
                title: this.props.template.meta.title || '',
                description: this.state.description || this.props.template.meta.description || '',
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

  countLines = () => {
    if (this.editorContainer.current) {
      this.editorContainer.current.querySelectorAll('.nlab-logic-editor-line').forEach((node, index) => {
        if (node && (node as HTMLElement).dataset.line !== `${index + 1}`)
          (node as HTMLElement).dataset.line = `${index + 1}`
      })
    }
  }

  toggleLines = () => {
    this.setState(
      (prevState) => ({ showLines: !prevState.showLines }),
      () => this.state.showLines && this.countLines()
    )
  }

  handleFocus = () => this.setState(() => ({ focused: true }))

  handleBlur = () => this.setState(() => ({ focused: false }))

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
        EditorState.createWithContent(prepareText(this.props.textEditor)).getCurrentContent().getPlainText(),
    }))
  }

  blockCustomizations = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType()
    const lineText = contentBlock.getText()

    if (/--Label/gi.test(lineText)) {
      return 'nlab-logic-editor-line nlab-logic-template-label'
    }

    if (lineText.startsWith('$')) {
      return 'nlab-logic-editor-line nlab-logic-template-question'
    }

    if (lineText.startsWith('#')) {
      return 'nlab-logic-editor-line nlab-logic-template-answer'
    }

    if (lineText.startsWith('//')) {
      return 'nlab-logic-editor-line nlab-logic-template-line-comment'
    }

    if (lineText.startsWith('+%')) {
      return 'nlab-logic-editor-line nlab-logic-template-anchor'
    }

    if (lineText.startsWith('=#')) {
      return 'nlab-logic-editor-line nlab-logic-template-add-rubrica'
    }

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
    if (this.props.scrollTo) this.handleScrollTo()
  }

  componentDidUpdate(prevProps: Readonly<BasicEditorProps>, prevState: Readonly<BasicEditorState>) {
    if (prevProps.editorsOpened !== this.props.editorsOpened) {
      this.setState(() => ({ isOpened: this.props.editorsOpened }))
    }

    if (this.props.scrollTo) {
      this.handleScrollTo()
    }

    if (this.state.showLines) {
      if (prevState.editorState !== this.state.editorState || prevState.isOpened !== this.state.isOpened) {
        this.countLines()
      }
    }
  }

  render() {
    const {
      showFullscreen,
      template,
      isPinned,
      selectedProfile,
      suiteId,
      currentUser,
      root,
      dlReadOnly,
      editorsSorting,
      selectedAccount,
    } = this.props
    const { isOpened, focused, saved, showLines, showDescription, description, editorState } = this.state
    const status = this.checkStatus()
    return (
      <InView root={root ? root.scrollerElement : null} rootMargin={'500px 0px'}>
        {({ inView, ref }) => {
          return (
            <div className={`editorItem in-view-${inView}`} ref={ref}>
              <div
                ref={this.editorContainer}
                className={`editor editor_basic${isOpened ? ' active' : ''}${!saved ? ' not-saved' : ''}${
                  focused ? ' focused' : ''
                }${!showLines ? ' no-lines' : ''}${template.is_enabled ? ' enabled' : ' disabled'}`}
                data-id={template.id}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              >
                {inView ? (
                  <>
                    <div className={`editorHeader ${status}`}>
                      <EditorsTitle
                        selectedProfileId={selectedProfile.id}
                        suiteId={suiteId}
                        template={template}
                        showFullscreen={showFullscreen}
                        handleOpen={this.handleOpen}
                        isPinned={isPinned}
                        currentUser={currentUser}
                        dlReadOnly={dlReadOnly}
                      />
                      <EditorsSettings
                        selectedProfile={selectedProfile}
                        suiteId={suiteId}
                        template={template}
                        showFullscreen={showFullscreen}
                        isOpened={isOpened}
                        isPinned={isPinned}
                        showDescription={showDescription}
                        positionSortingEnabled={editorsSorting.get('type') === 'position'}
                        sortingDirectionIsAsc={editorsSorting.get('isAsc')}
                        handleOpen={this.handleOpen}
                        toggleDescription={this.toggleDescription}
                        position={{ isFirst: this.props.position.isFirst, isLast: this.props.position.isLast }}
                        siblings={{ prev: this.props.siblings.prev, next: this.props.siblings.next }}
                        currentUser={currentUser}
                        selectedAccount={selectedAccount}
                      />
                    </div>
                    {isOpened && (
                      <>
                        <div className={`editorDescription${showDescription ? ' active' : ''}`}>
                          <div className="editorDescription-id">
                            ID: <span>{template.id}</span>
                          </div>
                          <textarea
                            name="editorDescription"
                            value={description}
                            placeholder={!description ? '(описание отсутствует)' : ''}
                            disabled={dlReadOnly}
                            onChange={({ target: { value } }) => this.handleDescriptionChange(value)}
                            onKeyDown={(ev) => !saved && this.handleCtrlS(ev)}
                          />
                        </div>
                        <div className="editorContent">
                          <button
                            className={`editorLinesBtn${showLines ? ' active' : ''}`}
                            onClick={this.toggleLines}
                            title={`${showLines ? 'Скрыть' : 'Показать'} нумерацию строк`}
                          >
                            <Icon icon={['far', showLines ? 'eye-slash' : 'eye']} props={{ size: 'sm' }} />
                          </button>
                          {editorState.getCurrentContent().getBlockMap().size * 34 + 100 > 600 && !showFullscreen && (
                            <>
                              <button
                                className="editorScrollBtn scroll-down"
                                onClick={this.scrollToBottom}
                                title="Прокрутить вниз"
                              >
                                <Icon icon={['fas', 'angle-double-down']} props={{ size: 'sm' }} />
                              </button>
                              <button
                                className="editorScrollBtn scroll-up"
                                onClick={this.scrollToTop}
                                title="Прокрутить вверх"
                              >
                                <Icon icon={['fas', 'angle-double-up']} props={{ size: 'sm' }} />
                              </button>
                            </>
                          )}
                          <ScrollbarCustom
                            className="editorInner"
                            innerRef={this.scrollbar}
                            noScrollX={true}
                            noScrollY={!showFullscreen}
                            translateContentSizeYToHolder={true}
                          >
                            <div className="editorTextarea-wrapper">
                              <Editor
                                ref={this.editor}
                                editorState={this.state.editorState}
                                onChange={this.handlEditorChange}
                                placeholder="Начните с вопроса..."
                                stripPastedStyles={true}
                                blockStyleFn={this.blockCustomizations}
                                handleKeyCommand={this.handleKeyCommand}
                                keyBindingFn={this.editorKeyBindingFn}
                              />
                            </div>
                          </ScrollbarCustom>
                          <div className="editorTools" ref={this.editorTools}>
                            {!dlReadOnly && (
                              <EditorsActions
                                forwardedRef={this.saveButton}
                                text={this.prepareTextForSaving()}
                                selectedProfileId={selectedProfile.id}
                                suiteId={suiteId}
                                template={template}
                                description={description}
                                isPinned={isPinned}
                                saved={saved}
                                showFullscreen={showFullscreen}
                                editorRef={this.editor}
                                containerRef={this.editorContainer}
                                currentUser={currentUser}
                                positionSortingEnabled={editorsSorting.get('type') === 'position'}
                                sortingDirectionIsAsc={editorsSorting.get('isAsc')}
                                stateHandlers={{
                                  discardHandler: this.discardHandler,
                                  saveHandler: this.saveHandler,
                                }}
                              />
                            )}
                            <EditorsUpdates lastUpdated={template.updated} lastUser={template.meta.last_user} />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : isOpened ? (
                  <pre
                    style={{
                      opacity: !inView ? 0 : 1,
                      height: editorState.getCurrentContent().getBlockMap().size * 34 + 230,
                    }}
                  >
                    {this.prepareTextForSaving()}
                  </pre>
                ) : (
                  <div style={{ height: 30 }} />
                )}
              </div>
            </div>
          )
        }}
      </InView>
    )
  }
}

export const mapStateToProps = (state: ReduxState, ownProps: BasicEditorOwnProps) => ({
  scrollTo: state.editors.get('scrollTo') === ownProps.template.id,
  showFullscreen: state.editors.get('fullscreenId') === ownProps.template.id,
  isPinned:
    state.toolbar.getIn(['templatesPinned', ownProps.suiteId]) &&
    state.toolbar.getIn(['templatesPinned', ownProps.suiteId]).has(ownProps.template.id),
  favTemplatesExpanded: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'favTemplatesExpanded',
    'value',
  ]),
  dlReadOnly: state.profiles.getIn(['selectedProfile', 'permissions', 'dl_write']) === false,
  showLinesCount: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'showLinesCount',
    'value',
  ]),
  editorsSorting: state.editors.get('editorsSorting'),
  selectedAccount: state.profiles.get('selectedAccount'),
})

export default connect(mapStateToProps)(BasicEditor)
