import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { setActiveTab, scrollToTemplate, closeOpenedTab, updateTabTitle } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import { Map } from 'immutable'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { SuiteItem } from '../../toolbar/toolbarSuites/toolbarSuites'
import { SUITES_QUERY } from '../../../graphql/queries/suitesQuery'
import ScrollbarCustom from '../../common/customScrollbar'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

type EditorsTabsOwnProps = {
  selectedProfile: ProfileItem
}

interface EditorsTabsProps {
  client: ApolloClient<NormalizedCacheObject>
  selectedProfile: ProfileItem
  openedTabs: Map<any, any>
  activeTab: string | null
  suitesSorting: Map<any, any>
}

export class EditorsTabs extends PureComponent<EditorsTabsProps> {
  setActive = (activeTab: string | null) => {
    scrollToTemplate(null)
    setActiveTab(activeTab)
  }

  removeTab = (suiteId: string, index: number) => {
    if (this.props.activeTab === suiteId) {
      const sortedTabs = this.sortTabs(this.props.openedTabs)
      if (
        sortedTabs.toList().get(index + 1) &&
        sortedTabs
          .toList()
          .get(index + 1)
          .get('id') !== suiteId
      ) {
        setActiveTab(
          sortedTabs
            .toList()
            .get(index + 1)
            .get('id')
        )
      } else if (
        sortedTabs.toList().get(index - 1) &&
        sortedTabs
          .toList()
          .get(index - 1)
          .get('id') !== suiteId
      ) {
        setActiveTab(
          sortedTabs
            .toList()
            .get(index - 1)
            .get('id')
        )
      } else {
        setActiveTab(null)
      }
    }

    closeOpenedTab(this.props.selectedProfile.id, suiteId)
  }

  closeAllTabs = () => {
    closeOpenedTab(this.props.selectedProfile.id, null)
    setActiveTab(null)
  }

  sortByDate = (a: Map<any, any>, b: Map<any, any>) => {
    const date1 = a.get('opened')
    const date2 = b.get('opened')
    if (!date1 || !date2) return this.sortByTitle(a, b)
    return date1 !== date2 ? (date1 < date2 ? -1 : 1) : this.sortByTitle(a, b)
  }

  sortByTitle = (a: Map<any, any>, b: Map<any, any>) => {
    return a.get('title') !== b.get('title') ? a.get('title').localeCompare(b.get('title')) : this.sortById(a, b)
  }

  sortById = (a: Map<any, any>, b: Map<any, any>) => {
    return a.get('id') < b.get('id') ? -1 : 1
  }

  sortTabs = (tabs: Map<any, any>) => {
    if (!tabs.size) return tabs
    return tabs.sort((a, b) => this.sortByDate(a, b))
  }

  getTitleFromCache = (suiteId: string) => {
    const sortType =
      typeof this.props.suitesSorting.get('sortType') === 'string'
        ? this.props.suitesSorting.get('sortType') === 'date'
          ? 'updated'
          : 'title'
        : 'title'
    const sortOrder =
      typeof this.props.suitesSorting.get('isAsc') === 'boolean' ? (this.props.suitesSorting.get('isAsc') ? 1 : -1) : 1
    let title = ''

    if (this.props.client) {
      try {
        const suitesCache: { suitesQueries: { items: SuiteItem[] } } | null = this.props.client.cache.readQuery({
          query: SUITES_QUERY,
          variables: {
            profile_ids: [this.props.selectedProfile.id],
            limit: 50000,
            order: {
              field: sortType,
              order: sortOrder,
            },
          },
        })
        if (suitesCache && suitesCache.suitesQueries && suitesCache.suitesQueries.items) {
          const suite = suitesCache.suitesQueries.items.filter((item) => item.id === suiteId)
          if (suite.length) {
            title = suite[0].title
            updateTabTitle(this.props.selectedProfile.id, suiteId, title)
          }
        }
      } catch (e) {}
    }

    return title
  }

  render() {
    const { openedTabs, activeTab } = this.props
    const sortedTabs = openedTabs && openedTabs.size ? this.sortTabs(openedTabs) : null
    if (!sortedTabs) return null
    return (
      <div className="editorsTabs-wrapper">
        <button className="editorsTabs-item close-all" title="Закрыть все вкладки" onClick={this.closeAllTabs}>
          <Icon icon={['fas', 'times']} props={{ size: 'lg' }} />
        </button>
        <ScrollbarCustom noScrollX={false} noScrollY>
          <ul className="editorsTabs">
            {sortedTabs.toList().map((suite: Map<any, any>, i: any) => {
              const isActiveTab = activeTab ? activeTab === suite.get('id') : false
              const tabTitle = suite.get('title') || this.getTitleFromCache(suite.get('id'))
              return (
                <li className={`editorsTabs-item${isActiveTab ? ' active' : ''}`} key={`tabs-${i}`} title={tabTitle}>
                  <button
                    className="editorsTabs-select"
                    onMouseUp={({ button }) => {
                      if (button === 0 && activeTab !== suite.get('id')) {
                        this.setActive(suite.get('id'))
                      } else if (button === 1) {
                        this.removeTab(suite.get('id'), i)
                      }
                    }}
                  />
                  <span>
                    <Icon icon={isActiveTab ? ['fas', 'folder-open'] : ['fas', 'folder']} />
                    {tabTitle}
                  </span>
                  <button
                    className="editorsTabs-close"
                    onClick={() => this.removeTab(suite.get('id'), i)}
                    title="Закрыть вкладку"
                  >
                    <Icon icon={['fas', 'times']} />
                  </button>
                </li>
              )
            })}
          </ul>
        </ScrollbarCustom>
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState, ownProps: EditorsTabsOwnProps) => ({
  openedTabs: state.editors.getIn(['openedTabs', ownProps.selectedProfile.id]),
  activeTab: state.editors.get('activeTab'),
  suitesSorting: state.toolbar.get('suitesSorting'),
})

export default connect(mapStateToProps)(withApollo<EditorsTabsProps>(EditorsTabs))
