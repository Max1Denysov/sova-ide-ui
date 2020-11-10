import React, { PureComponent } from 'react'
import { FixedSizeList } from 'react-window'
import OutBoundClick from '../../outboundClick/outBoundClick'
import VirtualListScrollbar from '../../common/virtualListScrollBar'
import Icon from '../../common/icon'
import { ProfileItem } from '../menuSelect/menuSelect'
import { RandomObject } from '../../../@types/common'
import {
  selectAccount,
  selectProfile,
  setAccountComplect,
  setCompilationDate,
} from '../../../store/dispatcher'
import { Map } from 'immutable'

interface MenuSelectDropDownProps {
  setDropDown(bool: boolean): void
  onSelectDropDownItem(item: { name: string; id: string }): void
  data: ProfileItem[]
  exceptions?: string[]
  selectedProfileId?: string
  activeItem: number
  setActiveNode(node: HTMLDivElement, parent: HTMLElement): void
  handleMouseEnter(index: number): void
  isSysAdmin: boolean
}

interface ListItemProps {
  index: number
  style: RandomObject
  data: ProfileItem[]
}

class MenuSelectDropDown extends PureComponent<MenuSelectDropDownProps> {
  listRef = React.createRef<FixedSizeList>()
  listItem = React.createRef<HTMLDivElement>()

  setDropDown = async (bool: boolean) => {
    await this.props.setDropDown(bool)
  }

  cancelAccountSelect = () => {
    selectProfile(null)
    selectAccount(Map())
    setAccountComplect(Map())
    setCompilationDate(Map())
  }

  componentDidUpdate(prevProps: MenuSelectDropDownProps) {
    if (
      prevProps.activeItem !== this.props.activeItem &&
      this.listItem.current &&
      this.listItem.current.parentElement &&
      this.listItem.current.parentElement.parentElement
    ) {
      this.props.setActiveNode(this.listItem.current, this.listItem.current.parentElement.parentElement)
    }
  }

  render() {
    const { selectedProfileId, isSysAdmin } = this.props
    const ListItem = ({ index, style, data }: ListItemProps) => {
      const item = data[index]
      return (
        <div
          title={item.name ? item.name : `ПРОФИЛЬ (${item.id})`}
          className={`dropdown-item${selectedProfileId === item.id ? ' selected' : ''}${
            this.props.activeItem === index ? ' active' : ''
          }`}
          style={style}
          ref={index === this.props.activeItem ? this.listItem : null}
          onClick={() => {
            this.props.onSelectDropDownItem(item)
            this.setDropDown(false)
          }}
          onMouseEnter={() => this.props.handleMouseEnter(index)}
        >
          {item.name ? item.name : `ПРОФИЛЬ (${item.id})`}
          {selectedProfileId && selectedProfileId === item.id && <Icon icon={['far', 'check-circle']} />}
        </div>
      )
    }

    const dropdownHeight = this.props.data.length > 10 ? 250 : this.props.data.length * 25
    return (
      <OutBoundClick
        className="dropdown"
        exceptions={this.props.exceptions}
        onClick={() => {
          this.setDropDown(false)
        }}
      >
        {this.props.data.length ? (
          <div className="dropdown-list">
            <FixedSizeList
              ref={this.listRef}
              width={'auto'}
              height={dropdownHeight}
              itemData={this.props.data}
              itemCount={this.props.data.length}
              itemSize={25}
              outerElementType={VirtualListScrollbar}
            >
              {ListItem}
            </FixedSizeList>
          </div>
        ) : !isSysAdmin ? (
          <div
            className="dropdown-item"
            onClick={this.cancelAccountSelect}
          >
            Не найдено. Выбрать другой аккаунт?
          </div>
        ) : (
          <div className="dropdown-item not-found">Не найдено</div>
        )}
      </OutBoundClick>
    )
  }
}

export default MenuSelectDropDown
