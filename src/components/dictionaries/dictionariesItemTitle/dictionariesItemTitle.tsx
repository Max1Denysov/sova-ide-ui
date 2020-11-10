import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { withApollo } from 'react-apollo'
import { DICTIONARY_UPDATE_MUTATION } from '../../../graphql/queries/dictionariesQueries'
import { formatText, stripTags } from '../../editor/basicEditor/text'
import { moveCursorToEnd } from '../../../utils/common'
import ApolloClient from 'apollo-client'
import { getDictsRefetchData } from '../../../utils/queries'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { Map } from 'immutable'

interface DictionaryTitleProps {
  client: ApolloClient<NormalizedCacheObject>
  title: string
  id: string
  selectedProfileId: string
  currentUser: Map<any, any>
}

interface DictionaryTitleState {
  title: string
  editable: boolean
}

export class DictionariesItemTitle extends PureComponent<DictionaryTitleProps, DictionaryTitleState> {
  inputRef = React.createRef<HTMLInputElement>()

  state = {
    title: this.props.title,
    editable: false,
  }

  editStart = () => {
    this.setState(
      {
        editable: true,
      },
      () => {
        if (this.inputRef && this.inputRef.current) moveCursorToEnd(this.inputRef.current)
      }
    )
  }

  mutate = () => {
    this.props.client && this.props.client.mutate({
      mutation: DICTIONARY_UPDATE_MUTATION,
      variables: {
        params: {
          id: this.props.id,
          code: formatText(stripTags(this.state.title)),
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
      refetchQueries: () => getDictsRefetchData(this.props.selectedProfileId),
    })
  }

  editEnd = (restoreInitial: boolean) => {
    if (!this.state.title) return this.inputRef.current!.focus()
    const val = restoreInitial === true ? this.props.title : this.state.title

    this.setState(
      {
        editable: false,
        title: val,
      },
      () => {
        if (!restoreInitial && val !== this.props.title) this.mutate()
        if (this.inputRef && this.inputRef.current) this.inputRef.current.blur()
      }
    )
  }

  onEnter = (key: string) => {
    if (key === 'Enter') {
      this.editEnd(false)
    }
    if (key === 'Escape') {
      this.editEnd(true)
    }
  }

  componentDidUpdate(prevProps: DictionaryTitleProps, prevState: DictionaryTitleState) {
    if (prevProps.title !== this.props.title) {
      this.setState({
        title: this.props.title,
      })
    }
  }

  render() {
    return (
      <div className="dict-title-wrapper">
        {this.state.editable ? (
          <>
            <input
              ref={this.inputRef}
              className={`dict-title-field${this.state.editable ? ' active' : ''}`}
              value={this.state.title}
              placeholder="Введите название словаря"
              onFocus={() => {
                document.addEventListener('keydown', ({ key }) => this.onEnter(key))
              }}
              onBlur={() => {
                document.removeEventListener('keydown', ({ key }) => this.onEnter(key))
              }}
              onChange={e => {
                this.setState({
                  title: e.target.value,
                })
              }}
              type="text"
            />
            <button
              className="dict-title-btn dict-title-restore"
              onClick={() => {
                this.editEnd(true)
              }}
            >
              <Icon icon={['fas', 'times']} props={{ size: 'sm' }} />
            </button>
            <button
              className="dict-title-btn dict-title-check"
              onClick={() => {
                this.editEnd(false)
              }}
            >
              <Icon icon={['fas', 'check']} props={{ size: 'sm' }} />
            </button>
          </>
        ) : (
          <>
            <span className="dict-title" onClick={this.editStart} title={this.state.title}>
              {this.state.title}
              <button className="dict-title-btn dict-title-edit" onClick={this.editStart}>
                <Icon icon={['fas', 'pencil-alt']} props={{ size: 'sm' }} />
              </button>
            </span>
          </>
        )}
      </div>
    )
  }
}

export default withApollo<DictionaryTitleProps>(DictionariesItemTitle)