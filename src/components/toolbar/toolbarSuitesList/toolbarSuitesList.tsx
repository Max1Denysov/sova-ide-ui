import React, { PureComponent } from 'react'
import ToolbarSuite from '../toolbarSuite/toolbarSuite'
import CustomVirtualScrollbar from '../../common/customVirtualScrollbar'
import { SuiteItem } from '../toolbarSuites/toolbarSuites'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import { setSuitesLoadingStatus } from '../../../store/dispatcher'
import { ApolloQueryResult } from 'apollo-client'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { Map } from 'immutable'
import { RandomObject } from '../../../@types/common'

interface ToolbarSuitesListProps {
  items: SuiteItem[]
  fetchMore?(): Promise<ApolloQueryResult<RandomObject>>
  selectedProfile: ProfileItem,
  templatesPinned: Map<any, any>
  openedTabs: Map<any, any>
}

export class ToolbarSuitesList extends PureComponent<ToolbarSuitesListProps> {
  getCustomHeight = (items: SuiteItem[]) => {
    let config: { [key: string]: number } = {}
    items.forEach((item, index) => {
      const isOpened =
        this.props.openedTabs.get(this.props.selectedProfile.id) &&
        this.props.openedTabs.get(this.props.selectedProfile.id).has(item.id)
      if (this.props.templatesPinned.get(item.id) && isOpened) {
        config[index] = this.props.templatesPinned.get(item.id).size
      }
    })
    return config
  }

  fetchMoreItems = async () => {
    if (this.props.fetchMore) {
      const { data } = await this.props.fetchMore()
      if (data && data.suitesQueries && data.suitesQueries.items && !data.suitesQueries.items.length) {
        setSuitesLoadingStatus(this.props.selectedProfile.id, true)
      } else {
        this.fetchMoreItems()
      }
      return
    }
  }

  componentDidMount() {
    this.fetchMoreItems()
  }

  render() {
    const { items, selectedProfile } = this.props
    const heightConfig = this.getCustomHeight(items)
    return (
      <CustomVirtualScrollbar
        scrollbarsClassName="toolbar-files-wrapper"
        containerClassName="toolbar-files toolbar-files_templates"
        itemsCount={items.length}
        itemHeight={20}
        subitemHeight={20}
        customHeightConfig={heightConfig}
      >
        {({ index, style }) => (
          <ToolbarSuite suite={items[index]} selectedProfile={selectedProfile} alwaysCollapsed style={style} />
        )}
      </CustomVirtualScrollbar>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  selectedProfile: state.profiles.get('selectedProfile'),
  templatesPinned: state.toolbar.get('templatesPinned'),
  openedTabs: state.editors.get('openedTabs'),
})

export default connect(mapStateToProps)(ToolbarSuitesList)