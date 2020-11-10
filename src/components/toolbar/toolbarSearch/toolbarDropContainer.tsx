import React, { PureComponent } from 'react'
import { FixedSizeList } from 'react-window'
import OutBoundClick from '../../outboundClick/outBoundClick'
import VirtualListScrollbar from '../../common/virtualListScrollBar'
import Icon from '../../common/icon'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { RandomObject } from '../../../@types/common'

interface ToolbarDropContainerProps {
  setDropDown(bool: boolean): void
  onSelectDropDownItem(item: { name: string; id: string }): void
  data: ProfileItem[]
  exceptions?: string[]
  selectedProfileId?: string
}

interface ListItemProps {
  index: number
  style: RandomObject
  data: ProfileItem[]
}

class ToolbarDropContainer extends PureComponent<ToolbarDropContainerProps> {
  listRef = React.createRef<FixedSizeList>()

  setDropDown = async (bool: boolean) => {
    await this.props.setDropDown(bool)
  }

  render() {
    const { selectedProfileId } = this.props
    const ListItem = ({ index, style, data }: ListItemProps) => {
      const item = data[index]
      return (
        <li
          title={item.name ? item.name : `ПРОФИЛЬ (${item.id})`}
          className={`dropdown-item${selectedProfileId === item.id ? ' selected' : ''}`}
          style={style}
          onClick={() => this.props.onSelectDropDownItem(item)}
        >
          {item.name ? item.name : `ПРОФИЛЬ (${item.id})`}
          {selectedProfileId && selectedProfileId === item.id && <Icon icon={['far', 'check-circle']} />}
        </li>
      )
    }

    return (
      <OutBoundClick
        className="dropdown"
        exceptions={this.props.exceptions}
        onClick={() => {
          this.setDropDown(false)
        }}
      >
        {this.props.data.length ? (
          <ul className="dropdown-list">
            <FixedSizeList
              ref={this.listRef}
              width={'auto'}
              height={this.props.data.length * 25}
              itemData={this.props.data}
              itemCount={this.props.data.length}
              itemSize={25}
              outerElementType={VirtualListScrollbar}
            >
              {ListItem}
            </FixedSizeList>
          </ul>
        ) : (
          <div className="dropdown-item not-found">Не найдено</div>
        )}
      </OutBoundClick>
    )
  }
}

export default ToolbarDropContainer
