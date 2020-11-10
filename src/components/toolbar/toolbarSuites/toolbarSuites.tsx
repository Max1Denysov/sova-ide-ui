import React, { PureComponent } from 'react'
import { Map, List, fromJS } from 'immutable'
import { Query, QueryResult } from 'react-apollo'
import { connect } from 'react-redux'
import { SUITES_QUERY } from '../../../graphql/queries/suitesQuery'
import Icon from '../../common/icon'
import * as utils from '../../../utils/common'
import {
  selectUnselectSuites,
  setSuitesChecked,
  setSuitesSorting,
  setSearchValues,
} from '../../../store/dispatcher'
import { suitesSortingConfig } from '../../../routes/configs/toolbarConfig'
import { ReduxState } from '../../../store/store'
import ApolloLoading from '../../common/apolloLoading'
import ApolloError from '../../common/apolloError'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import ToolbarSuitesList from '../toolbarSuitesList/toolbarSuitesList'

export interface SuiteItem {
  id: string
  hidden: boolean
  profile_id: string | null
  stat: { templates: number }
  is_enabled: boolean
  title: string
  updated: number
}

interface ToolbarSuitesProps {
  selectedProfile: ProfileItem
  rehydrated: boolean
  showHeader?: boolean
  checkAllSuites: boolean
  suitesSorting: Map<any, any>
  selectedSuites: Map<any, any>
  searchValues: List<string>
  dlReadOnly: boolean
  allSuitesLoaded: Map<any, any>
  showHiddenSuites: boolean
}

interface ToolbarSuitesState {
  shouldChangeAll: boolean
}

export class ToolbarSuites extends PureComponent<ToolbarSuitesProps, ToolbarSuitesState> {
  state = {
    shouldChangeAll: false,
  }

  suites: SuiteItem[] = []

  refetchQuery = () => {}

  checkAllSuites = () => {
    this.setState(() => ({ shouldChangeAll: true }))
    setSuitesChecked(!this.props.checkAllSuites)
  }

  filterSuites = (suites: SuiteItem[]) => {
    return suites.filter(suite => {
      if (suite.hidden && !this.props.showHiddenSuites) return false
      if (!this.props.searchValues.size) return true
      return utils.filterList(suite.title, this.props.searchValues)
    })
  }

  handleCheckAll = () => {
    if (this.suites.filter(suite => !suite.hidden).length) {
      let suitesToCheck = Map()
      this.suites.filter(suite => !suite.hidden).forEach(suite => {
        if (!this.props.selectedSuites.has(suite.id)) {
          suitesToCheck = suitesToCheck.set(suite.id, Map(fromJS(suite)))
        }
      })
      if (suitesToCheck.size) selectUnselectSuites(suitesToCheck)
    }
  }

  sortByTitle = (a: SuiteItem, b: SuiteItem) => {
    return a.title !== b.title ? a.title.localeCompare(b.title) : a.id.localeCompare(b.id)
  }

  sortByDate = (a: SuiteItem, b: SuiteItem) => {
    const date1 = a.updated
    const date2 = b.updated

    return date1 !== date2 ? (date1 < date2 ? -1 : 1) : this.sortByTitle(a, b)
  }

  sortByCount = (a: SuiteItem, b: SuiteItem) => {
    return a.stat.templates !== b.stat.templates
      ? a.stat.templates < b.stat.templates
        ? -1
        : 1
      : this.sortByTitle(a, b)
  }

  sortAndFilterSuites = (items: SuiteItem[]) => {
    let output = this.filterSuites(items)

    const sortType = this.props.suitesSorting.get('type')
    output = output.sort((a, b) => {
      if (sortType === 'title') {
        return this.sortByTitle(a, b)
      } else if (sortType === 'date') {
        return this.sortByDate(a, b)
      } else {
        return this.sortByCount(a, b)
      }
    })
    if (!this.props.suitesSorting.get('isAsc')) output.reverse()

    this.suites = output
    return output
  }

  componentDidMount() {
    selectUnselectSuites(null)
    if (this.props.checkAllSuites) setSuitesChecked(false)
    if (this.props.searchValues.size) setSearchValues('suites', [])
    if (this.props.rehydrated) this.refetchQuery()
  }

  componentDidUpdate(prevProps: Readonly<ToolbarSuitesProps>) {
    if (prevProps.rehydrated !== this.props.rehydrated || prevProps.selectedProfile !== this.props.selectedProfile) {
      this.props.rehydrated && this.refetchQuery()
    }

    if (prevProps.checkAllSuites !== this.props.checkAllSuites) {
      if (this.props.checkAllSuites) {
        this.handleCheckAll()
      } else {
        if (this.state.shouldChangeAll) selectUnselectSuites(null)
      }
      this.setState(() => ({ shouldChangeAll: false }))
    }

    if (
      prevProps.selectedSuites.size > this.props.selectedSuites.size &&
      this.props.checkAllSuites &&
      this.props.selectedSuites.size !== this.suites.filter(suite => !suite.hidden).length
    ) {
      setSuitesChecked(false)
    }

    if (
      prevProps.selectedSuites.size !== this.props.selectedSuites.size &&
      this.props.selectedSuites.size === this.suites.filter(suite => !suite.hidden).length &&
      !this.props.checkAllSuites
    ) {
      setSuitesChecked(true)
    }

    if (prevProps.selectedProfile.id !== this.props.selectedProfile.id) {
      selectUnselectSuites(null)
    }
  }

  componentWillUnmount() {
    selectUnselectSuites(null)
  }

  render() {
    const { selectedProfile, showHeader, suitesSorting, selectedSuites, checkAllSuites, dlReadOnly, allSuitesLoaded } = this.props
    const allItemsLoaded = selectedProfile.id ? allSuitesLoaded.get(selectedProfile.id) : false
    const sortType = typeof suitesSorting.get('sortType') === 'string'
      ? suitesSorting.get('sortType') === 'date' ? 'updated' : 'title'
      : 'title'
    const sortOrder = typeof suitesSorting.get('isAsc') === 'boolean'
      ? suitesSorting.get('isAsc') ? 1 : -1
      : 1
    return selectedProfile.id ? (
      <>
        {showHeader && (
          <div className="toolbar-files-header">
            {!dlReadOnly && (
              <button
                className={`toolbar-file-select${
                  checkAllSuites && selectedSuites.size === this.suites.filter(suite => !suite.hidden).length ? ' checked' : ''
                }`}
                onClick={this.checkAllSuites}
              >
                <Icon
                  icon={['far', checkAllSuites && selectedSuites.size === this.suites.filter(suite => !suite.hidden).length ? 'check-circle' : 'circle']}
                />
              </button>
            )}
            {suitesSortingConfig.map((el, index) => (
              <button
                key={index}
                className={`toolbar-file-sort sort-${el.type}${
                  suitesSorting.get('type') === el.type ? ' active' : ''
                }`}
                onClick={() => setSuitesSorting(el.type)}
              >
                {suitesSorting.get('type') === el.type && (
                  <Icon icon={['fas', suitesSorting.get('isAsc') ? 'caret-up' : 'caret-down']} />
                )}
                {el.title}
              </button>
            ))}
          </div>
        )}
        <Query
          query={SUITES_QUERY}
          variables={{
            profile_ids: [selectedProfile.id],
            limit: allItemsLoaded ? 50000 : 500,
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
            if (loading && !data) return <ApolloLoading/>
            if (error) return <ApolloError errorMsg={error.message} />
            const items = data && data.suitesQueries && data.suitesQueries.items
              ? this.sortAndFilterSuites(data.suitesQueries.items)
              : []

            if (!items.length) return <div className="toolbar-no-filtered-info">Данные отсутствуют!</div>

            const renderSuites = () => {
              return (
                <ToolbarSuitesList
                  items={items}
                  fetchMore={!allItemsLoaded ? () => fetchMore({
                    variables: {
                      silent: true,
                      profile_id: selectedProfile.id,
                      offset: items.length,
                      limit: 1000,
                      order: {
                        field: sortType,
                        order: sortOrder,
                      },
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult || !fetchMoreResult.suitesQueries || !fetchMoreResult.suitesQueries.items) {
                        return prev
                      }
                      if (!prev) return prev
                      return {
                        ...prev,
                        suitesQueries: {
                          ...prev.suitesQueries,
                          items: prev.suitesQueries.items.concat(fetchMoreResult.suitesQueries.items)
                        }
                      }
                    }
                  }) : undefined}
                />
              )
            }

            if (networkStatus === 4) return renderSuites()
            return renderSuites()
          }}
        </Query>
      </>
    ) : null
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  selectedProfile: state.profiles.get('selectedProfile'),
  rehydrated: state._persist.rehydrated,
  checkAllSuites: state.toolbar.get('checkAllSuites'),
  suitesSorting: state.toolbar.get('suitesSorting'),
  selectedSuites: state.editors.get('selectedSuites'),
  searchValues: state.menu.getIn(['searchValues', 'suites']),
  dlReadOnly: state.profiles.getIn(['selectedProfile', 'permissions', 'dl_write']) === false,
  allSuitesLoaded: state.toolbar.get('allSuitesLoaded'),
  showHiddenSuites: state.toolbar.get('showHiddenSuites'),
})

export default connect(mapStateToProps)(ToolbarSuites)
