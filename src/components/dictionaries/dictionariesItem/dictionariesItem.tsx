import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import DictionariesEditor from '../dictionariesEditor/dictionariesEditor'
import DictionariesItemTitle from '../dictionariesItemTitle/dictionariesItemTitle'
import { Mutation, Query, QueryResult, withApollo } from 'react-apollo'
import { DICTIONARY_FETCH_QUERY, DICTIONARY_UPDATE_MUTATION } from '../../../graphql/queries/dictionariesQueries'
import { closeDictionary, displayDictionaryEditor, selectProfile, setActiveTab } from '../../../store/dispatcher'
import { animated } from 'react-spring/renderprops'
import CustomSelect from '../../common/customSelect'
import { List, Map, Set } from 'immutable'
import OutBoundClick from '../../outboundClick/outBoundClick'
import ApolloLoading from '../../common/apolloLoading'
import ApolloError from '../../common/apolloError'
import ScrollbarCustom from '../../common/customScrollbar'
import ApolloClient from 'apollo-client'
import { PROFILE_QUERIES_GQL, PROFILE_QUERIES_GQL_SYS_ADMIN } from '../../../graphql/queries/profilesQueries'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { getDictsRefetchData, getProfilesConfig } from '../../../utils/queries'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { RandomObject } from '../../../@types/common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

const options = List([
  Map({ name: 'Общий', value: 'common', isCommon: true }),
  Map({ name: 'Уникальный', value: 'unique', isCommon: false }),
])

export interface DictItem {
  id: string
  hidden: boolean
  is_enabled: boolean
  common: boolean
  content: string
  code: string
  description: string
  updated: number
  profile_ids: string[]
  meta: {
    last_user: {
      uuid: string
      name: string
      username: string
      user_role: string
    } | null
  }
}

interface DictionariesItemProps {
  rehydrated: boolean
  dictId: string
  templateId?: string
  isEditorsPage?: boolean
  style?: RandomObject
  dictAnimationFinish?: boolean
  currentUser: Map<any, any>
  selectedProfileId: string
  client: ApolloClient<NormalizedCacheObject>
  openedTabs: Map<any, any>
  showLinesCount: boolean
  selectedAccount: Map<any, any>
}

interface DictEditorProps {
  push?(link: string): void
  data: {
    dictionariesQueries: {
      item: DictItem
    }
  }
  params: {
    isEditorsPage?: boolean
    dictId: string
    templateId?: string
    style?: RandomObject
    dictAnimationFinish?: boolean
    currentUser: Map<any, any>
    selectedProfileId: string
  }
  client: ApolloClient<NormalizedCacheObject>
  openedTabs: Map<any, any>
  showLinesCount: boolean
  selectedAccount: Map<any, any>
}

interface DictEditorState {
  showDescription: boolean
  isExpanded: boolean
}

export class DictionariesItem extends PureComponent<DictEditorProps, DictEditorState> {
  state = {
    showDescription: false,
    isExpanded: false
  }

  getProfilesFromCache = (profile_ids: string[]) => {
    let profiles = Map()
    let profileIds = Set(profile_ids)

    if (this.props.client && this.props.client.cache) {
      const isSysAdmin = this.props.params.currentUser.getIn(['role', 'type']) === 'sys_admin'
      try {
        const profilesCache: { profilesQueries: { items: ProfileItem[] } } | null = this.props.client.cache.readQuery({
          query: isSysAdmin ? PROFILE_QUERIES_GQL_SYS_ADMIN : PROFILE_QUERIES_GQL,
          variables: getProfilesConfig(this.props.params.currentUser, this.props.selectedAccount),
        })
        if (profilesCache && profilesCache.profilesQueries && profilesCache.profilesQueries.items) {
          profilesCache.profilesQueries.items.forEach(item => {
            if (!profiles.has(item.id) && profileIds.has(item.id)) {
              profiles = profiles.set(item.id, item)
            }
          })
        }
      } catch (e) {}
    }

    return profiles
  }

  toggleDescription = () => this.setState(prevState => ({ showDescription: !prevState.showDescription }))

  toggleExpand = () => this.setState(prevState => ({ isExpanded: !prevState.isExpanded }))

  render() {
    const { showDescription, isExpanded } = this.state
    const { data, params, openedTabs, showLinesCount } = this.props
    const {
      isEditorsPage,
      dictId,
      templateId,
      style,
      dictAnimationFinish,
      currentUser,
      selectedProfileId,
    } = params
    const {
      is_enabled,
      common,
      content,
      code,
      description,
      updated,
      profile_ids,
      meta: { last_user },
    } = data.dictionariesQueries.item
    const value = common
      ? Map({ name: 'Общий', value: 'common', isCommon: true })
      : Map({ name: 'Уникальный', value: 'unique', isCommon: false })
    const isDictAvailableToAttach = !profile_ids.includes(selectedProfileId)
    const updatedProfileIds = isDictAvailableToAttach
      ? profile_ids.concat(selectedProfileId)
      : profile_ids.filter(id => id !== selectedProfileId)
    const availableProfiles = this.getProfilesFromCache(profile_ids)
    return (
      <div
        className={`dict-item${
          isEditorsPage ? ' dict-item_editors' : ''
        }${
          is_enabled ? ' enabled' : ' disabled'
        }${
          isExpanded ? ' expanded' : ''
        }`}
      >
        <OutBoundClick
          className="dict-item-container"
          outboundClickEnabled={!!isEditorsPage}
          onClick={() => displayDictionaryEditor(false, dictId, templateId)}
          exceptions={['navbar', 'dict-title', 'dict-header']}
        >
          <animated.div
            style={{ transform: style != null && style.transform }}
            className="dict-item-inner"
            data-id={dictId}
          >
            <div className="dict-header">
              <div className="flex items-center w-full">
                {!!selectedProfileId && (
                  <Mutation
                    mutation={DICTIONARY_UPDATE_MUTATION}
                    variables={{
                      params: { id: dictId, profile_ids: updatedProfileIds }
                    }}
                    refetchQueries={() => getDictsRefetchData(selectedProfileId)}
                  >
                    {(mutate: () => void) => {
                      return (
                        <button
                          className={`pin-to-profile${!isDictAvailableToAttach ? ' pinned' : ''}`}
                          onClick={() => mutate()}
                          title={
                            isDictAvailableToAttach
                              ? 'Прикрепить словарь к выбранному профилю'
                              : 'Открепить словарь от выбранного профиля'
                          }
                        >
                          <Icon icon={['fas', 'thumbtack']} />
                        </button>
                      )
                    }}
                  </Mutation>
                )}
                <DictionariesItemTitle
                  title={code}
                  id={dictId}
                  selectedProfileId={selectedProfileId}
                  currentUser={currentUser}
                />
                <div className="dict-header-right">
                  <div className="custom-checkbox">
                    <Mutation
                      mutation={DICTIONARY_UPDATE_MUTATION}
                      variables={{
                        params: { id: dictId, common: !common }
                      }}
                    >
                      {(mutate: () => void) => {
                        return (
                          <CustomSelect
                            value={value}
                            options={options}
                            onSelect={(item: Map<any, any>) => {
                              if (common !== item.get('isCommon')) mutate()
                            }}
                            defaultPlaceholder="Выберите тип"
                            itemHeight={32}
                          />
                        )
                      }}
                    </Mutation>
                  </div>
                  <button
                    className="dict-header-btn"
                    onClick={this.toggleDescription}
                    title={`${showDescription ? 'Скрыть' : 'Показать'} описание словаря`}
                  >
                    <Icon icon={['fas', 'align-left']}/>
                  </button>
                  {!isEditorsPage && (
                    <button
                      className="dict-header-btn"
                      onClick={this.toggleExpand}
                      title={`${isExpanded ? 'Свернуть' : 'Развернуть'} словарь`}
                    >
                      <Icon icon={['fas', isExpanded ? 'compress-alt' : 'expand-alt']}/>
                    </button>
                  )}
                  <button
                    className="dict-header-btn"
                    onClick={() =>
                      isEditorsPage ? displayDictionaryEditor(false, dictId, templateId) : closeDictionary(dictId)
                    }
                    title="Закрыть словарь"
                  >
                    <Icon icon={['fas', 'times']} />
                  </button>
                </div>
              </div>
            </div>
            <div className="dict-main">
              <DictionariesEditor
                id={dictId}
                updated={updated}
                currentUser={currentUser}
                lastUser={last_user}
                content={content}
                code={code}
                description={description}
                common={common}
                profile_ids={profile_ids}
                selectedProfileId={selectedProfileId}
                isEditorsPage={isEditorsPage}
                dictAnimationFinish={dictAnimationFinish}
                isEnabled={is_enabled}
                showLinesCount={showLinesCount}
                showDescription={showDescription}
              />
              {profile_ids.length > 0 && availableProfiles.size > 0 && (
                <div className="dict-relatedProfiles-wrapper">
                  <span className="dict-relatedProfiles-top-text">Используется в профилях:</span>
                  <div className="flex-grow">
                    <ScrollbarCustom className="dict-relatedProfiles-list-scrollbar">
                      <ul className="dict-relatedProfiles-list">
                        {profile_ids.map((item, i) => {
                          const profile = availableProfiles.get(item) as ProfileItem
                          if (!profile) return null
                          return (
                            <li key={i}>
                              <Link
                                to="/"
                                className="dict-relatedProfiles-link"
                                title={profile.name}
                                onClick={() => {
                                  this.props.push && this.props.push('/')
                                  if (profile) {
                                    selectProfile(profile)
                                    if (openedTabs && openedTabs.get(profile.id) && openedTabs.get(profile.id).size) {
                                      setActiveTab(
                                        openedTabs
                                          .get(profile.id)
                                          .last()
                                          .get('id')
                                      )
                                    } else {
                                      setActiveTab(null)
                                    }
                                  }
                                }}
                              >
                                <span className="dict-relatedProfiles-name">{profile.name}</span>
                                <Icon icon={['fas', 'angle-double-right']} props={{ size: 'sm' }} />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </ScrollbarCustom>
                  </div>
                </div>
              )}
            </div>
          </animated.div>
        </OutBoundClick>
        {isEditorsPage && <animated.div style={{ opacity: style != null && style.opacity }} className="dict-item-bg" />}
      </div>
    )
  }
}

export class DictItemWithQuery extends PureComponent<DictionariesItemProps> {
  refetchQuery = () => {}

  componentDidMount() {
    if (this.props.rehydrated) this.refetchQuery()
  }

  componentDidUpdate(prevProps: Readonly<DictionariesItemProps>) {
    if (prevProps.rehydrated !== this.props.rehydrated && this.props.rehydrated) {
      this.refetchQuery()
    }
  }

  render() {
    const {
      dictId,
      templateId,
      isEditorsPage,
      style,
      dictAnimationFinish,
      currentUser,
      selectedProfileId,
      client,
      openedTabs,
      showLinesCount,
      selectedAccount,
    } = this.props
    const vars = { id: dictId }
    const params = {
      isEditorsPage,
      dictId,
      templateId,
      style,
      dictAnimationFinish,
      currentUser,
      selectedProfileId,
      showLinesCount,
    }
    return (
      <Query
        query={DICTIONARY_FETCH_QUERY}
        variables={{ ...vars }}
      >
        {(result: QueryResult) => {
          if (!result) return null
          const { loading, error, data, refetch, networkStatus } = result
          try {
            this.refetchQuery = refetch
          } catch (e) {}
          if (loading && !data) return <ApolloLoading />
          if (error) {
            return (
              <div className="dict-item">
                <ApolloError errorMsg={error.message} />
              </div>
            )
          }

          if (!data || !data.dictionariesQueries || !data.dictionariesQueries.item) return null

          const renderDictionary = () => {
            return (
              <DictionariesItem
                key={dictId}
                data={data}
                params={params}
                client={client}
                openedTabs={openedTabs}
                showLinesCount={showLinesCount}
                selectedAccount={selectedAccount}
              />
            )
          }

          if (networkStatus === 4) return renderDictionary()
          return renderDictionary()
        }}
      </Query>
    )
  }
}

export default connect(null, { push })(withApollo<DictionariesItemProps>(DictItemWithQuery))