import React, { PureComponent } from 'react'
import { FixedSizeList } from 'react-window'
import VirtualListScrollbar from '../../common/virtualListScrollBar'
import Icon from '../../common/icon'
import { DICTIONARY_CREATE_MUTATION } from '../../../graphql/queries/dictionariesQueries'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { getDictsRefetchData } from '../../../utils/queries'
import { RandomObject } from '../../../@types/common'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

interface DropDownSuggestionProps {
  setDropDown(bool: boolean): void
  setValueOnSelect(elem: { code: string; id: string }): void
  handleMouseEnter(index: number): void
  onSelectDropDownItem(item: { name: string; id: string }): void
  data: RandomObject
  value: string
  exceptions?: string[]
  selectedProfileId?: string
  setActiveNode(node: HTMLElement | null): void
  activeItem: number
  client: ApolloClient<NormalizedCacheObject>
}

interface ListItemProps {
  index: number
  style: RandomObject
  data: RandomObject
}

interface DropDownSuggestionState {
  value: string
}

export class DropDownSuggestion extends PureComponent<DropDownSuggestionProps, DropDownSuggestionState> {
  state = {
    value: '',
  }
  listRef = React.createRef<FixedSizeList>()
  listItem = React.createRef<HTMLDivElement>()

  mutate = () =>
    this.props.client && this.props.client.mutate({
      mutation: DICTIONARY_CREATE_MUTATION,
      variables: {
        params: {
          code: this.props.value.replace(/\[dict\(/gm, ''),
          content: 'New template',
          description: '',
          common: true,
          profile_ids: [this.props.selectedProfileId],
        }
      },
      refetchQueries: () => getDictsRefetchData(this.props.selectedProfileId),
    })

  handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: ev.target.value.replace(/\[dict\(/gm, '') })
  }

  handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    const {
      data: {
        dictionariesMutations: {
          response: { id },
        },
      },
    } = await this.mutate()
    const code = this.state.value.replace(/\[dict\(/gm, '')
    this.props.setValueOnSelect({ code, id })
  }

  componentDidUpdate(prevProps: DropDownSuggestionProps) {
    if (prevProps.activeItem !== this.props.activeItem) {
      this.props.setActiveNode(this.listItem.current)
    }

    if (prevProps.value !== this.props.value) {
      this.setState(() => ({ value: this.props.value }))
    }
  }

  componentDidMount() {
    const value = this.props.value.replace(/\[dict\(/gm, '')
    this.setState(() => ({ value }))
  }

  render() {
    const { data, selectedProfileId, activeItem } = this.props
    const ListItem = ({ index, style, data }: ListItemProps) => {
      const item = data[index]
      return (
        <div
          title={item.name ? item.name : `СЛОВАРЬ ${item.code}`}
          className={`dropdown-item${selectedProfileId === item.id ? ' selected' : ''}${
            activeItem === index ? ' active' : ''
          }`}
          ref={index === activeItem ? this.listItem : null}
          style={style}
          onClick={() => this.props.onSelectDropDownItem(item)}
          onMouseEnter={() => this.props.handleMouseEnter(index)}
        >
          {item.code}
          {selectedProfileId && selectedProfileId === item.id && <Icon icon={['far', 'check-circle']} />}
        </div>
      )
    }

    return (
      <>
        {data.length ? (
          <div className="suggestions-dropdown">
            <FixedSizeList
              ref={this.listRef}
              width={300}
              height={175}
              itemData={data}
              itemCount={data.length}
              itemSize={25}
              outerElementType={VirtualListScrollbar}
            >
              {ListItem}
            </FixedSizeList>
          </div>
        ) : (
          <div className="suggestions-not-found-wrapper">
            <div className="mb-10">Словари не найдены</div>
            <form className="flex" onSubmit={this.handleSubmit}>
              <input
                className="suggestions-not-found-add-input"
                type="text"
                onChange={this.handleInputChange}
                value={this.state.value}
              />
              <button type="submit" className="suggestions-not-found-add">
                Добавить
              </button>
            </form>
          </div>
        )}
      </>
    )
  }
}

export default withApollo<DropDownSuggestionProps>(DropDownSuggestion)