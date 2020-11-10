import React, { Component } from 'react'
import BasicEditor from './basicEditor/basicEditor'
import EditorsTabs from './editorsTabs/editorsTabs'
import EditorsFilter from './editorsFilter/editorsFilter'
import { connect } from 'react-redux'
import { Query, QueryResult } from 'react-apollo'
import { TEMPLATES_QUERY } from '../../graphql/queries/templatesQuery'
import { toggleFullscreen, displayDictionaryEditor } from '../../store/dispatcher'
import { ReduxState } from '../../store/store'
import { Map, List } from 'immutable'
import DictionariesItem from '../dictionaries/dictionariesItem/dictionariesItem'
import TransitionCustom from '../common/customTransition'
import ApolloError from '../common/apolloError'
import ApolloLoading from '../common/apolloLoading'
import ScrollbarCustom from '../common/customScrollbar'
import Scrollbars from 'react-scrollbars-custom'
import { ProfileItem } from '../menu/menuSelect/menuSelect'
import EditorsSorting from './editorsSorting/editorsSorting'
import EditorsCreate from './editorsCreate/editorsCreate'
import Icon from '../common/icon'
import * as utils from '../../utils/common'
import WorkareaEmpty from '../workarea/workareaEmpty/workareaEmpty'

export interface TemplateItem {
  id: string
  position: number
  content: string
  created: number
  updated: number
  is_enabled: boolean
  profile_id: string
  suite_id: string
  suite_title: string
  meta: {
    title: string | null
    description: string | null
    last_user: {
      uuid: string
      name: string
      username: string
      user_role: string
    } | null
  }
  stats: {
    last_used: string
    used_7d: number
    used_30d: number
  }
}

interface EditorsProps {
  rehydrated: boolean
  openedTabs: Map<any, any>
  activeTab: string | null
  editorsFilter: Map<any, any>
  editorsSorting: Map<any, any>
  currentUser: Map<any, any>
  animationEnabled: boolean
  editorsOpened: boolean
  fullscreenId: string | null
  selectedProfile: ProfileItem
  displayDictionaryEditor: Map<string, boolean | string>
  dlReadOnly: boolean
  searchValues: List<string>
  showLinesCount: boolean
  selectedAccount: Map<any, any>
}

interface EditorsState {
  dictAnimationFinish: boolean
  allOpened: boolean
}

export class Editors extends Component<EditorsProps, EditorsState> {
  state = {
    dictAnimationFinish: false,
    allOpened: this.props.editorsOpened,
  }

  scrollbars = React.createRef<Scrollbars>()

  refetchQuery = () => {}

  fullScreenHandler = (ev: Event) => {
    const id = (ev.target as HTMLDivElement).dataset.id
    if (id) toggleFullscreen(this.props.fullscreenId === id ? null : id)
  }

  filterTemplates = (templates: TemplateItem[]) => {
    return templates.filter(template => utils.filterList(template.meta.title || '', this.props.searchValues))
  }

  sortAndFilter = (dataReady: { templatesQueries: { items: TemplateItem[] } }) => {
    if (
      !dataReady ||
      !dataReady.templatesQueries ||
      !dataReady.templatesQueries.items ||
      !dataReady.templatesQueries.items.length
    )
      return []

    const sortType = this.props.editorsSorting.get('type')
    let output = dataReady.templatesQueries.items.sort((a, b) => {
      if (sortType === 'created' && a.created && b.created) {
        return a.created !== b.created ? (a.created < b.created ? -1 : 1) : a.id.localeCompare(b.id)
      } else if (sortType === 'updated' && a.updated && b.updated) {
        return a.updated !== b.updated ? (a.updated < b.updated ? -1 : 1) : a.id.localeCompare(b.id)
      } else if (sortType === 'position' && a.position && b.position) {
        return a.position !== b.position
          ? (a.position < b.position ? -1 : 1)
          : a.updated !== b.updated ? (b.updated < a.updated ? -1 : 1) : a.id.localeCompare(b.id)
      } else {
        return a.id.localeCompare(b.id)
      }
    })
    if (!this.props.editorsSorting.get('isAsc')) output.reverse()

    output = output.filter(item => {
      const status = item.is_enabled ? 'showOk' : 'showAttention'
      return this.props.editorsFilter.get(status)
    })

    if (this.props.searchValues.size) output = this.filterTemplates(output)
    return output
  }

  toggleOpenStatus = () => this.setState(prevState => ({ allOpened: !prevState.allOpened }))

  componentDidMount() {
    if (this.props.fullscreenId !== null) toggleFullscreen(null)
    if (this.props.rehydrated) this.refetchQuery()

    document.addEventListener('fullscreenchange', this.fullScreenHandler)
    document.addEventListener('webkitfullscreenchange', this.fullScreenHandler)
    document.addEventListener('mozfullscreenchange', this.fullScreenHandler)
    document.addEventListener('MSFullscreenChange', this.fullScreenHandler)

    const dictId = this.props.displayDictionaryEditor.get('dictId') as string
    const templateId = this.props.displayDictionaryEditor.get('templateId') as string
    displayDictionaryEditor(false, dictId, templateId)
  }

  componentDidUpdate(prevProps: Readonly<EditorsProps>) {
    if (prevProps.rehydrated !== this.props.rehydrated && this.props.rehydrated) {
      this.refetchQuery()
    }

    if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab) {
      this.setState(() => ({ allOpened: this.props.editorsOpened }), this.refetchQuery)
    }

    if (prevProps.displayDictionaryEditor.get('status') !== this.props.displayDictionaryEditor.get('status')) {
      this.setState(() => ({ dictAnimationFinish: false }))
    }
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.fullScreenHandler)
    document.removeEventListener('webkitfullscreenchange', this.fullScreenHandler)
    document.removeEventListener('mozfullscreenchange', this.fullScreenHandler)
    document.removeEventListener('MSFullscreenChange', this.fullScreenHandler)
  }

  render() {
    const {
      rehydrated,
      openedTabs,
      currentUser,
      animationEnabled,
      activeTab,
      selectedProfile,
      displayDictionaryEditor,
      dlReadOnly,
      showLinesCount,
      selectedAccount,
    } = this.props
    const { dictAnimationFinish, allOpened } = this.state
    const displayDictionary = displayDictionaryEditor.get('status')
    const dictId = displayDictionaryEditor.get('dictId') as string
    const templateId = displayDictionaryEditor.get('templateId') as string
    return (
      <div id="react__editors" className="editors">
        <EditorsTabs selectedProfile={selectedProfile} />
        <div className="editorsContent">
          {(!!activeTab &&
          openedTabs &&
          openedTabs.get(selectedProfile.id) &&
          openedTabs.get(selectedProfile.id).size) ? (
            <>
              <div className="editorsTopPanel">
                <EditorsFilter />
              </div>
              <div className="editorsTopPanel">
                <EditorsSorting />
                {!dlReadOnly && <EditorsCreate />}
                <button
                  className="editors-toggle-btn expand"
                  onClick={this.toggleOpenStatus}
                  title={`${allOpened ? 'Свернуть' : 'Развернуть'} все шаблоны`}
                >
                  <Icon icon={['fas', allOpened ? 'compress' : 'expand']} props={{ size: 'lg' }} />
                </button>
              </div>
              <ScrollbarCustom className="editorsWrapper" innerRef={this.scrollbars}>
                <div className="editorsContainer">
                  <Query
                    query={TEMPLATES_QUERY}
                    variables={{ suite_id: activeTab }}
                  >
                    {(result: QueryResult) => {
                      if (!result) return null
                      const { loading, error, data, refetch, networkStatus } = result
                      try {
                        this.refetchQuery = refetch
                      } catch (e) {}
                      if (loading && !data) return <ApolloLoading />
                      if (error) return <ApolloError errorMsg={error.message} />

                      const renderTemplates = (dataReady: { templatesQueries: { items: TemplateItem[] } }) => {
                        const templatesOutput = this.sortAndFilter(dataReady)
                        return templatesOutput.length ? (
                          <>
                            {templatesOutput.map((template, index) => (
                              <BasicEditor
                                key={template.id}
                                suiteId={activeTab || ''}
                                template={template}
                                currentUser={currentUser}
                                animationEnabled={animationEnabled}
                                editorsOpened={allOpened}
                                textEditor={template.content}
                                selectedProfile={selectedProfile}
                                root={this.scrollbars.current}
                                position={{
                                  isFirst: template === templatesOutput.slice().shift(),
                                  isLast: template === templatesOutput.slice().pop(),
                                }}
                                siblings={{
                                  prev: templatesOutput[index - 1],
                                  next: templatesOutput[index + 1],
                                }}
                              />
                            ))}
                          </>
                        ) : (
                          <WorkareaEmpty>Добавьте<br/>шаблон</WorkareaEmpty>
                        )
                      }

                      if (networkStatus === 4) renderTemplates(data)
                      return renderTemplates(data)
                    }}
                  </Query>
                </div>
              </ScrollbarCustom>
            </>
          ) : (
            <WorkareaEmpty>
              Выберите<br/>{!selectedAccount.size ? 'аккаунт' : selectedProfile.id ? 'набор' : 'профиль'}
            </WorkareaEmpty>
          )}
        </div>
        <TransitionCustom
          from={{ opacity: 0, transform: 'translateY(500px)' }}
          enter={{ opacity: 0.75, transform: 'translateY(0px)' }}
          leave={{ opacity: 0, transform: 'translateY(500px)' }}
          items={displayDictionary}
          unique
          native
          onRest={() => this.setState(() => ({ dictAnimationFinish: true }))}
        >
          {(show: boolean) =>
            show &&
            (props => (
              <DictionariesItem
                key={dictId}
                rehydrated={rehydrated}
                dictId={dictId}
                selectedProfileId={selectedProfile.id}
                currentUser={currentUser}
                templateId={templateId}
                dictAnimationFinish={dictAnimationFinish}
                style={props}
                isEditorsPage={true}
                openedTabs={openedTabs}
                showLinesCount={showLinesCount}
                selectedAccount={selectedAccount}
              />
            ))
          }
        </TransitionCustom>
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  openedTabs: state.editors.get('openedTabs'),
  activeTab: state.editors.get('activeTab'),
  editorsFilter: state.editors.get('editorsFilter'),
  editorsSorting: state.editors.get('editorsSorting'),
  currentUser: state.auth.get('user'),
  searchValues: state.menu.getIn(['searchValues', 'editors']),
  animationEnabled: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'animationEnabled',
    'value',
  ]),
  editorsOpened: state.settings.getIn(['userSettings', 'common', 'visual', 'clientSettings', 'editorsOpened', 'value']),
  fullscreenId: state.editors.get('fullscreenId'),
  selectedProfile: state.profiles.get('selectedProfile'),
  displayDictionaryEditor: state.editors.get('displayDictionaryEditor'),
  dlReadOnly: state.profiles.getIn(['selectedProfile', 'permissions', 'dl_write']) === false,
  showLinesCount: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'showLinesCount',
    'value',
  ]),
  selectedAccount: state.profiles.get('selectedAccount'),
})

export default connect(mapStateToProps)(Editors)
