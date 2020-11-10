import React, { PureComponent, useState } from 'react'
import { Query, QueryResult } from 'react-apollo'
import { connect } from 'react-redux'
import { dictionaryActions } from '../../../routes/configs/toolbarConfig'
import ToolbarDictionariesList from '../toolbarDictionariesList/toolbarDictionariesList'
import { ReduxState } from '../../../store/store'
import { DICTIONARIES_QUERY } from '../../../graphql/queries/dictionariesQueries'
import ApolloLoading from '../../common/apolloLoading'
import ApolloError from '../../common/apolloError'
import EmptyComponent from '../../common/emptyComponent'
import ToolbarSearch from '../toolbarSearch/toolbarSearch'
import Icon from '../../common/icon'
import ToolbarActions from '../toolbarActions/toolbarActions'
import { Map } from 'immutable'
import ErrorBoundary from '../../errorBoundary/errorBoundary'
import { selectUnselectDictionaries, setDictionariesChecked, toggleHiddenDicts } from '../../../store/dispatcher'

interface ToolbarDictionariesProps {
  hideHeader?: boolean
  rehydrated: boolean
  selectedProfileId: string
  dictionariesSorting: Map<any, any>
  allDictsLoaded: boolean
  showHiddenDicts: boolean
}

interface ToolbarDictsWithQueryProps {
  rehydrated: boolean
  selectedProfileId: string
  dictionariesSorting: Map<any, any>
  dictionariesCategory: string
  allDictsLoaded: boolean
}

export class ToolbarDictsWithQuery extends PureComponent<ToolbarDictsWithQueryProps> {
  refetchQuery = () => {}

  componentDidMount() {
    selectUnselectDictionaries(null)
    setDictionariesChecked(null)
    if (this.props.rehydrated) this.refetchQuery()
  }

  componentDidUpdate(prevProps: Readonly<ToolbarDictsWithQueryProps>, prevState: Readonly<{}>) {
    if (prevProps.rehydrated !== this.props.rehydrated && this.props.rehydrated) {
      this.refetchQuery()
    }
  }

  componentWillUnmount() {
    selectUnselectDictionaries(null)
    setDictionariesChecked(null)
  }

  render() {
    const { selectedProfileId, dictionariesSorting, dictionariesCategory, allDictsLoaded } = this.props
    const sortType =
      typeof dictionariesSorting.getIn([dictionariesCategory, 'sortType']) === 'string'
        ? dictionariesSorting.getIn([dictionariesCategory, 'sortType']) === 'title'
          ? 'code'
          : 'updated'
        : 'code'
    const sortOrder =
      typeof dictionariesSorting.getIn([dictionariesCategory, 'isAsc']) === 'boolean'
        ? dictionariesSorting.getIn([dictionariesCategory, 'isAsc'])
          ? 1
          : -1
        : 1
    return (
      <Query
        query={DICTIONARIES_QUERY}
        variables={{
          profile_id: selectedProfileId,
          limit: allDictsLoaded ? 50000 : 500,
          order: {
            field: sortType,
            order: sortOrder,
          },
        }}
      >
        {(result: QueryResult) => {
          if (!result) return null
          const { loading, error, data, refetch, networkStatus, fetchMore } = result
          try {
            this.refetchQuery = refetch
          } catch (e) {}
          if (loading && !data) return <ApolloLoading />
          if (error) return <ApolloError errorMsg={error.message} />
          const items =
            data && data.dictionariesQueries && data.dictionariesQueries.items ? data.dictionariesQueries.items : []
          if (!items.length) return <EmptyComponent />

          const renderDictionaries = () => {
            return (
              <ErrorBoundary componentWithError='ToolbarDictionariesListWithError'>
                <ToolbarDictionariesList
                  data={items}
                  profile_id={selectedProfileId}
                  showHeader
                  fetchMore={
                    !allDictsLoaded
                      ? () => fetchMore({
                        variables: {
                          silent: true,
                          profile_id: selectedProfileId,
                          offset: items.length,
                          limit: 1000,
                          order: {
                            field: sortType,
                            order: sortOrder,
                          },
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (
                            !fetchMoreResult ||
                            !fetchMoreResult.dictionariesQueries ||
                            !fetchMoreResult.dictionariesQueries.items
                          ) {
                            return prev
                          }
                          if (!prev) return prev
                          return {
                            ...prev,
                            dictionariesQueries: {
                              ...prev.dictionariesQueries,
                              items: prev.dictionariesQueries.items.concat(fetchMoreResult.dictionariesQueries.items),
                            },
                          }
                        },
                      })
                      : undefined
                  }
                />
              </ErrorBoundary>
            )
          }

          if (networkStatus === 4) return renderDictionaries()
          return renderDictionaries()
        }}
      </Query>
    )
  }
}

export const ToolbarDictionaries = React.memo<ToolbarDictionariesProps>(props => {
  const [filterActive, setFilterActive] = useState(false)
  const { hideHeader, selectedProfileId, dictionariesSorting, rehydrated, allDictsLoaded, showHiddenDicts } = props
  const dictionariesCategory = selectedProfileId ? 'private' : 'all'
  const dictsToRequest = selectedProfileId ? [selectedProfileId, ''] : ['']
  return (
    <>
      {!hideHeader && (
        <>
          <div className="toolbar-block-selector">
            <span className="toolbar-category-toggle active">Выберите словари</span>
            <button
              onClick={() => toggleHiddenDicts(!showHiddenDicts)}
              className={`toolbar-category-toggle toolbar-category-toggle_btn`}
              title={`${showHiddenDicts ? 'Скрыть' : 'Показать'} недоступные словари`}
            >
              <Icon icon={['far', showHiddenDicts ? 'eye-slash' : 'eye']}/>
            </button>
            <button
              onClick={() => setFilterActive(!filterActive)}
              className={`toolbar-category-toggle toolbar-category-toggle_btn${filterActive ? ' active' : ''}`}
              title="Фильтр"
            >
              <Icon icon={['fas', 'filter']} />
            </button>
          </div>
          {filterActive && <ToolbarSearch category="dictionaries" />}
        </>
      )}
      <div className="toolbar-categories category-dictionaries">
        {dictsToRequest.map((x, k) => (
            <ToolbarDictsWithQuery
              key={k}
              rehydrated={rehydrated}
              dictionariesSorting={dictionariesSorting}
              dictionariesCategory={dictionariesCategory}
              selectedProfileId={x}
              allDictsLoaded={allDictsLoaded}
            />
        ))}
      </div>
      <ToolbarActions config={dictionaryActions} renderForm alwaysShow />
    </>
  )
})

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  selectedProfileId: state.profiles.get('selectedProfile').id,
  dictionariesSorting: state.toolbar.get('dictionariesSorting'),
  allDictsLoaded: state.toolbar.get('allDictsLoaded'),
  showHiddenDicts: state.toolbar.get('showHiddenDicts'),
})

export default connect(mapStateToProps)(ToolbarDictionaries)