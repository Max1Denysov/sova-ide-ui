import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OutBoundClick from '../outboundClick/outBoundClick'
import { List, Map } from 'immutable'
import Icon from './icon'
import VirtualListScrollbar from './virtualListScrollBar'
import { FixedSizeList } from 'react-window'

interface SelectProps {
  group?: string
  id?: string
  value: Map<any, any>
  options: List<Map<any, any>>
  updateValue?(group: string, settings: string, id: string, item: Map<any, any>): void
  onSelect?(item: Map<any, any>): void
  multiSelect?: boolean
  hideMultiTags?: boolean
  disabled?: boolean
  defaultPlaceholder?: string
  itemHeight?: number
  itemsVisible?: number
}

interface SelectState {
  isDroppedDown: boolean
  placeholder: string
  multiValues: Map<any, any>
}

class CustomSelect extends PureComponent<SelectProps, SelectState> {
  state = {
    isDroppedDown: false,
    placeholder:
      (this.props.value && this.props.value.get('name')) ||
      this.props.defaultPlaceholder ||
      `Выберите вариант${this.props.multiSelect ? 'ы' : ''}`,
    multiValues: this.props.value,
  }

  listRef = React.createRef<FixedSizeList>()

  setDropDown = () => this.setState((prevState) => ({ isDroppedDown: !prevState.isDroppedDown }))

  onSelectDropDownItem = (item: Map<any, any>) => {
    this.setState(
      (prevState) => ({
        placeholder: this.props.multiSelect ? this.props.defaultPlaceholder || 'Выберите варианты' : item.get('name'),
        isDroppedDown: !!this.props.multiSelect,
        multiValues: prevState.multiValues.has(item.get('value'))
          ? prevState.multiValues.delete(item.get('value'))
          : item.get('required')
          ? //@ts-ignore
            prevState.multiValues.filter((item) => !item.get('required')).set(item.get('value'), item)
          : prevState.multiValues.set(item.get('value'), item),
      }),
      () => {
        if (this.props.group && this.props.id && typeof this.props.updateValue === 'function') {
          this.props.updateValue(this.props.group, 'clientSettings', this.props.id, item)
        }

        if (typeof this.props.onSelect === 'function') {
          this.props.onSelect(this.props.multiSelect ? this.state.multiValues : item)
        }
      }
    )
  }

  removeMultiValue = (value: string) => {
    this.setState((prevState) => ({ multiValues: prevState.multiValues.delete(value) }))
  }

  componentDidUpdate(prevProps: Readonly<SelectProps>, prevState: Readonly<SelectState>) {
    if (prevProps.value !== this.props.value) {
      this.setState(() => ({
        placeholder:
          (this.props.value && this.props.value.get('name')) ||
          this.props.defaultPlaceholder ||
          `Выберите вариант${this.props.multiSelect ? 'ы' : ''}`,
        multiValues: this.props.value,
      }))
    }

    if (this.props.multiSelect && prevState.multiValues.size !== this.state.multiValues.size) {
      if (typeof this.props.onSelect === 'function') this.props.onSelect(this.state.multiValues)
    }
  }

  render() {
    const { options, multiSelect, hideMultiTags, disabled, itemHeight, itemsVisible } = this.props
    const { isDroppedDown, placeholder, multiValues } = this.state
    const dropdownHeight = options
      ? options.size > 5
        ? (itemHeight || 25) * (itemsVisible ? (options.size < itemsVisible ? options.size : itemsVisible) : 5)
        : options.size * (itemHeight || 25)
      : 0
    return (
      <div className={`custom-select${disabled ? ' disabled' : ''}${isDroppedDown ? ' opened' : ''}`}>
        {multiSelect && !hideMultiTags && (
          <ul className={`dropdown-multi${disabled ? ' disabled' : ''}`}>
            {multiValues.toList().map((value: Map<any, any>, key: any) => (
              <li
                key={key}
                className="dropdown-multi-item"
                onClick={() => (!disabled || !value.get('required') ? this.removeMultiValue(value.get('value')) : {})}
              >
                {value.get('name')}
              </li>
            ))}
          </ul>
        )}
        {(!multiSelect || !disabled) && (
          <>
            <div className="custom-select-visible" onClick={!disabled ? this.setDropDown : () => {}}>
              <div className="custom-select-input">{placeholder}</div>
              {!disabled && (
                <button className={`custom-select-toggle-dropdown${isDroppedDown ? ' active' : ''}`} type="button">
                  <FontAwesomeIcon icon={['fas', 'caret-down']} />
                </button>
              )}
            </div>
            {isDroppedDown && (
              <OutBoundClick onClick={this.setDropDown} exceptions={multiSelect ? ['dropdown-item'] : []}>
                <ul className="dropdown">
                  <FixedSizeList
                    ref={this.listRef}
                    width={'auto'}
                    height={dropdownHeight}
                    itemCount={options.size}
                    itemSize={itemHeight || 25}
                    outerElementType={VirtualListScrollbar}
                  >
                    {({ index, style }) => {
                      const item = options.get(index)
                      const isSelected =
                        item &&
                        ((multiSelect && multiValues.has(item.get('value'))) || placeholder === item.get('name'))
                      const isRequired = item ? !!item.get('required') : false
                      const isDivided = item ? !!item.get('divided') : false
                      return item ? (
                        <li
                          key={index}
                          className={`dropdown-item${isSelected ? ' selected' : ''}${
                            isSelected && isRequired ? ' required' : ''
                          }${isDivided ? ' divided' : ''}`}
                          onClick={() => (isSelected && isRequired ? {} : this.onSelectDropDownItem(item))}
                          style={style}
                        >
                          {item.get('name')}
                          {isSelected && <Icon icon={['far', 'check-circle']} />}
                        </li>
                      ) : null
                    }}
                  </FixedSizeList>
                </ul>
              </OutBoundClick>
            )}
          </>
        )}
      </div>
    )
  }
}

export default CustomSelect
