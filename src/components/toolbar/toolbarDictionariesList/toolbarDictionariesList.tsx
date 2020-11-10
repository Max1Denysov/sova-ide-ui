import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Map, List, fromJS } from 'immutable'
import Icon from '../../common/icon'
import {
  setDictionariesChecked,
  setDictionariesSorting,
  selectUnselectDictionaries,
  setSearchValues, setDictsLoadingStatus,
} from '../../../store/dispatcher'
import { dictsSortingConfig } from '../../../routes/configs/toolbarConfig'
import ToolbarDictionary from '../toolbarDictionary/toolbarDictionary'
import { ReduxState } from '../../../store/store'
import CustomVirtualScrollbar from '../../common/customVirtualScrollbar'
import { sortDicts, filterList } from '../../../utils/common'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { ApolloQueryResult } from 'apollo-client'
import ApolloLoading from '../../common/apolloLoading'
import { DictItem } from '../../dictionaries/dictionariesItem/dictionariesItem'
import { RandomObject } from '../../../@types/common'

interface ToolbarDictionariesListProps {
  selectedProfile: ProfileItem
  rehydrated: boolean
  checkAllDictionaries: boolean
  dictionariesCategory: string
  dictionariesSorting: Map<any, any>
  selectedDictionaries: Map<any, any>
  isTemplatesPage: boolean
  data: DictItem[]
  dictCurrentSortCategory: string
  profile_id: string
  showHeader?: boolean
  searchValues: List<string>
  allDictsLoaded: boolean
  showHiddenDicts: boolean
  fetchMore?(): Promise<ApolloQueryResult<RandomObject>>
}

interface ToolbarDictionariesListOwnProps {
  data: DictItem[]
  profile_id: string
  showHeader?: boolean
  fetchMore?(): Promise<ApolloQueryResult<RandomObject>>
}

interface ToolbarDictionariesListState {
  isExpanded: boolean
  isListFull: boolean
}

export class ToolbarDictionariesList extends PureComponent<ToolbarDictionariesListProps, ToolbarDictionariesListState> {
  state = {
    isExpanded: true,
    isListFull: this.props.allDictsLoaded,
  }

  handleCheckAll = () => {
    if (this.props.data.length) {
      let dictsToCheck = Map()
      this.props.data.filter(dict => !dict.hidden).forEach(item => {
        if (!this.props.selectedDictionaries.has(item.id)) {
          dictsToCheck = dictsToCheck.set(item.id, Map(fromJS(item)))
        }
      })
      if (dictsToCheck.size) selectUnselectDictionaries(dictsToCheck)
    }
  }

  checkAllDicts = () => setDictionariesChecked(this.props.dictionariesCategory)

  sortAndFilterDicts = () => {
    let dictsList = this.props.data.filter((item: DictItem) => {
      if (item.hidden && !this.props.showHiddenDicts) return false
      if (!this.props.searchValues.size) return true
      return filterList(item.code, this.props.searchValues)
    })
    dictsList = sortDicts(dictsList, this.props.dictionariesCategory, this.props.dictionariesSorting)

    return dictsList
  }

  fetchMoreItems = async () => {
    if (this.props.fetchMore) {
      try {
        const { data } = await this.props.fetchMore()
        if (data && data.dictionariesQueries && data.dictionariesQueries.items && !data.dictionariesQueries.items.length) {
          this.setState(() => ({
            isListFull: true,
          }), () => setDictsLoadingStatus(true))
        } else {
          this.fetchMoreItems()
        }
        return
      } catch (e) {}
    }
  }

  componentDidMount() {
    if (this.props.searchValues.size) setSearchValues('dictionaries', [])
    this.fetchMoreItems()
  }

  componentDidUpdate(prevProps: Readonly<ToolbarDictionariesListProps>, prevState: ToolbarDictionariesListState) {
    if (prevProps.checkAllDictionaries !== this.props.checkAllDictionaries && this.props.checkAllDictionaries) {
      this.handleCheckAll()
    }

    if (prevProps.checkAllDictionaries !== this.props.checkAllDictionaries && !this.props.checkAllDictionaries) {
      selectUnselectDictionaries(null)
    }
  }

  render() {
    const {
      selectedProfile,
      showHeader,
      dictionariesSorting,
      profile_id,
      isTemplatesPage,
      dictionariesCategory,
    } = this.props
    const { isListFull } = this.state
    const selectedAll = this.props.checkAllDictionaries
    const { isExpanded } = this.state
    const dictsList = this.sortAndFilterDicts()
    const listHeight = dictsList.length * 20 + 85
    return (
      <>
        <div
          key={dictionariesSorting.get(dictionariesCategory)}
          className={`toolbar-category${isExpanded ? ' expanded' : ''}`}
          style={{ maxHeight: listHeight }}
        >
          <div className="toolbar-category-inner">
            <div
              className="toolbar-category-toggle toolbar-category-toggle_inner"
              onClick={() =>
                this.setState(prevState => ({
                  isExpanded: !prevState.isExpanded,
                }))
              }
            >
              <span className="mr-10">{profile_id ? selectedProfile.name : 'все словари'}</span>
              <Icon
                className={`toolbar-category-arrow toolbar-category-arrow_dictionary${isExpanded ? ' up' : ''}`}
                icon={['fas', 'chevron-down']}
              />
            </div>

            {isExpanded && (
              <>
                {dictsList.length ? (
                  <>
                    {showHeader && (
                      <div className="toolbar-files-header">
                        <button
                          className={`toolbar-file-select${selectedAll ? ' checked' : ''}`}
                          onClick={this.checkAllDicts}
                        >
                          <Icon icon={['far', selectedAll ? 'check-circle' : 'circle']}/>
                        </button>
                        {dictsSortingConfig.map((el, index) => (
                          <button
                            key={index}
                            className={`toolbar-file-sort sort-${el.type}${
                              dictionariesSorting.get('type') === el.type ? ' active' : ''
                            }`}
                            onClick={() => setDictionariesSorting(el.type, dictionariesCategory)}
                          >
                            {dictionariesSorting.getIn([dictionariesCategory, 'sortType']) === el.type && (
                              <Icon
                                icon={[
                                  'fas',
                                  dictionariesSorting.getIn([dictionariesCategory, 'isAsc']) ? 'caret-up' : 'caret-down',
                                ]}
                              />
                            )}
                            {el.title}
                          </button>
                        ))}
                      </div>
                    )}
                    <CustomVirtualScrollbar
                      scrollbarsClassName="toolbar-files-wrapper"
                      containerClassName="toolbar-files"
                      itemsCount={dictsList.length}
                      itemHeight={20}
                      subitemHeight={17}
                    >
                      {({ index, style }) => (
                        <ToolbarDictionary
                          key={index}
                          style={style}
                          category={this.props.dictionariesCategory}
                          dict={dictsList[index]}
                          isTemplatesPage={isTemplatesPage}
                        />
                      )}
                    </CustomVirtualScrollbar>
                  </>
                ) : (
                  <div className="toolbar-no-filtered-info">Словари не найдены!</div>
                )}
              </>
            )}
          </div>
        </div>
        {!isListFull && <ApolloLoading/>}
      </>
    )
  }
}

export const mapStateToProps = (state: ReduxState, ownProps: ToolbarDictionariesListOwnProps) => {
  const templatesPagePath = state.router.location.pathname
  const sortCategory = ownProps.profile_id ? 'private' : 'all'
  return {
    isTemplatesPage: templatesPagePath === '/' || templatesPagePath === '/templates/',
    selectedProfile: state.profiles.get('selectedProfile'),
    rehydrated: state._persist.rehydrated,
    dictionariesCategory: sortCategory,
    dictCurrentSortCategory: state.toolbar.get('dictionariesSorting').get(sortCategory),
    dictionariesSorting: state.toolbar.get('dictionariesSorting'),
    searchValues: state.menu.getIn(['searchValues', 'dictionaries']),
    checkAllDictionaries: state.toolbar.get('checkAllDictionaries').get(sortCategory),
    selectedDictionaries: state.editors.get('selectedDictionaries'),
    allDictsLoaded: state.toolbar.get('allDictsLoaded'),
    showHiddenDicts: state.toolbar.get('showHiddenDicts'),
  }
}

export default connect(mapStateToProps)(ToolbarDictionariesList)