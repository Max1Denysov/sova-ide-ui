import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import {
  setOpenedDictionaries,
  selectUnselectDictionaries,
  scrollToDictionary,
  displayDictionaryEditor,
} from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import { getDate } from '../../../utils/common'
import { DICTIONARY_FETCH_QUERY, DICTIONARY_UPDATE_MUTATION } from '../../../graphql/queries/dictionariesQueries'
import { withApollo } from 'react-apollo'
import OutBoundClick from '../../outboundClick/outBoundClick'
import ApolloClient from 'apollo-client'
import { getDictsRefetchData } from '../../../utils/queries'
import { RandomObject } from '../../../@types/common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { DictItem } from '../../dictionaries/dictionariesItem/dictionariesItem'
import { Map, fromJS } from 'immutable'

type ToolbarDictOwnProps = {
  dict: DictItem
  isTemplatesPage: boolean
  category: string
  style?: RandomObject
}

interface ToolbarDictProps {
  client: ApolloClient<NormalizedCacheObject>
  dict: DictItem
  isOpened: boolean
  category: string
  isSelected: boolean
  isEnabled: boolean
  isTemplatesPage: boolean
  isOpenedInEditors: boolean
  selectedProfileId: string
  currentUser: Map<any, any>
  style?: RandomObject
}

interface ToolbarDictState {
  nameIsChanging: boolean
  newDictName: string
}

export class ToolbarDictionary extends PureComponent<ToolbarDictProps, ToolbarDictState> {
  state = {
    nameIsChanging: false,
    newDictName: '',
  }

  selectDict = (dict: DictItem) => {
    if (!this.props.dict.hidden) selectUnselectDictionaries(Map(fromJS(dict)))
  }

  handleNameChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const newDictName = ev.currentTarget.value
    this.setState(() => ({ newDictName }))
  }

  handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (!this.state.newDictName.trim() || this.state.newDictName.trim() === this.props.dict.code)
      return this.restoreInitialName()
    if (this.props.client) {
      this.props.client
        .mutate({
          mutation: DICTIONARY_UPDATE_MUTATION,
          variables: {
            params: {
              id: this.props.dict.id,
              code: this.state.newDictName,
              meta: {
                last_user: {
                  uuid: this.props.currentUser.get('uuid'),
                  name: this.props.currentUser.get('name') || '',
                  username: this.props.currentUser.get('username'),
                  user_role: this.props.currentUser.getIn(['role', 'type']),
                },
              }
            }
          },
          refetchQueries: () => getDictsRefetchData(this.props.selectedProfileId).concat([
            { query: DICTIONARY_FETCH_QUERY, variables: { id: this.props.dict.id } }
          ]),
        })
    }
  }

  restoreInitialName = () => {
    this.setState(() => ({ nameIsChanging: false, newDictName: '' }))
  }

  toggleDict = debounce((clicksNumber: number) => {
    if (this.state.nameIsChanging || this.props.dict.hidden) return
    if (clicksNumber === 1) {
      if (this.props.isTemplatesPage) {
        displayDictionaryEditor(true, this.props.dict.id)
      } else {
        setOpenedDictionaries(this.props.dict.id, Date.now())
        scrollToDictionary(this.props.dict.id)
      }
    } else if (clicksNumber > 1) {
      this.setState(() => ({ nameIsChanging: true }))
    }
  }, 300)

  handleStateChange = () => {
    if (this.props.client && !this.props.dict.hidden) {
      this.props.client.mutate({
        mutation: DICTIONARY_UPDATE_MUTATION,
        variables: {
          params: {
            id: this.props.dict.id,
            is_enabled: !this.props.dict.is_enabled,
            meta: {
              last_user: {
                uuid: this.props.currentUser.get('uuid'),
                name: this.props.currentUser.get('name') || '',
                username: this.props.currentUser.get('username'),
                user_role: this.props.currentUser.getIn(['role', 'type']),
              },
            }
          }
        },
        refetchQueries: () => getDictsRefetchData(this.props.selectedProfileId).concat([
          { query: DICTIONARY_FETCH_QUERY, variables: { id: this.props.dict.id } }
        ]),
      })
    }
  }

  componentDidMount() {
    if (this.props.isSelected && this.props.isEnabled !== undefined && this.props.isEnabled !== this.props.dict.is_enabled) {
      selectUnselectDictionaries(Map().set(this.props.dict.id, this.props.dict))
    }
  }

  render() {
    const {
      dict,
      isSelected,
      isOpened,
      isTemplatesPage,
      isOpenedInEditors,
      style
    } = this.props
    const { nameIsChanging } = this.state
    const title = dict.code
    const highlightDicts = isTemplatesPage ? isOpenedInEditors : isOpened
    return (
      <div className={`toolbar-file${nameIsChanging ? ' opened' : ''}`} style={style}>
        <div className={`toolbar-file-header${dict.hidden ? ' is-hidden' : ''}`} data-id={dict.id}>
          <button
            className={`toolbar-file-select${isSelected ? ' checked' : ''}`}
            onClick={() => this.selectDict(dict)}
          >
            <Icon icon={['far', isSelected ? 'check-circle' : 'circle']} />
          </button>
          <button
            className={`toolbar-file-state${dict.is_enabled ? ' enabled' : ' disabled'}`}
            title={dict.is_enabled ? 'Деактивировать словарь' : 'Активировать словарь'}
            onClick={this.handleStateChange}
          >
            <Icon icon={['fas', 'book']} />
            <Icon icon={['fas', dict.is_enabled ? 'play' : 'pause']} props={{ size: 'sm' }} />
          </button>
          <div
            className={`toolbar-file-toggle${highlightDicts ? ' opened' : ''}`}
            onClick={({ detail }: any) => this.toggleDict(detail)}
          >
            {nameIsChanging ? (
              <OutBoundClick className="toolbar-file-title-form" onClick={this.restoreInitialName}>
                <form className="flex" onSubmit={this.handleSubmit}>
                  <input
                    defaultValue={title}
                    autoFocus
                    type="text"
                    className="toolbar-file-name"
                    onChange={this.handleNameChange}
                  />
                  <button
                    type="button"
                    className="toolbar-title-btn toolbar-title-restore"
                    onClick={(ev: React.MouseEvent) => {
                      ev.stopPropagation()
                      this.restoreInitialName()
                    }}
                  >
                    <Icon icon={['fas', 'times']} props={{ size: 'sm' }} />
                  </button>
                  <button
                    type="submit"
                    className="toolbar-title-btn toolbar-title-check"
                    onClick={(ev: React.MouseEvent) => ev.stopPropagation()}
                  >
                    <Icon icon={['fas', 'check']} props={{ size: 'sm' }} />
                  </button>
                </form>
              </OutBoundClick>
            ) : (
              <span className="toolbar-file-name" title={title}>
                {title}
              </span>
            )}

            {!nameIsChanging && <span className="toolbar-file-changed">{getDate(dict.updated)}</span>}
          </div>
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState, ownProps: ToolbarDictOwnProps) => {
  const { editors } = state
  const displayDictionaryEditor = editors.get('displayDictionaryEditor')
  return {
    isOpened: editors.get('openedDictionaries').has(ownProps.dict.id),
    isSelected: editors.get('selectedDictionaries').has(ownProps.dict.id),
    isEnabled: editors.getIn(['selectedDictionaries', ownProps.dict.id, 'is_enabled']),
    isOpenedInEditors: displayDictionaryEditor.get('status') && displayDictionaryEditor.get('id') === ownProps.dict.id,
    selectedProfileId: state.profiles.get('selectedProfile').id,
    currentUser: state.auth.get('user'),
  }
}

export default connect(mapStateToProps)(withApollo<ToolbarDictProps>(ToolbarDictionary))