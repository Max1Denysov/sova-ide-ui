import React, { PureComponent } from 'react'
import Icon from '../../common/icon'
import { setSearchValues } from '../../../store/dispatcher'

interface ToolbarSearchProps {
  category: string
  placeholder?: string
}

interface ToolbarSearchState {
  value: string
  searchValues: string[]
}

class ToolbarSearch extends PureComponent<ToolbarSearchProps, ToolbarSearchState> {
  inputRef = React.createRef<HTMLInputElement>()

  state = {
    value: '',
    searchValues: [],
  }

  onInputData = (ev: React.FormEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value
    setSearchValues(this.props.category, [...this.state.searchValues, value.trim()])
    this.setState(() => ({ value }))
  }

  clearInput = () => {
    this.setState(() => ({
      value: '',
    }))
  }

  setSearchValues = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    this.clearInput()
    const isValueAlreadyExists = this.state.searchValues.some(
      (val: string) =>
        val.replace(/\s/g, '').toLocaleLowerCase() === this.state.value.replace(/\s/g, '').toLocaleLowerCase()
    )

    if (!this.state.value.trim() || isValueAlreadyExists) return this.inputRef.current!.focus()
    this.setState(prevState => ({
      searchValues: [...prevState.searchValues, this.state.value],
    }))
  }

  removeItem = (i: number) => {
    const newSearchValues = [...this.state.searchValues]
    newSearchValues.splice(i, 1)
    this.setState({
      searchValues: newSearchValues,
    })
  }

  componentDidMount() {
    setSearchValues(this.props.category, [])
    if (this.inputRef && this.inputRef.current) this.inputRef.current.focus()
  }

  componentWillUnmount() {
    setSearchValues(this.props.category, [])
  }

  componentDidUpdate(prevProps: ToolbarSearchProps, prevState: ToolbarSearchState) {
    if (prevProps.category !== this.props.category) {
      this.setState(() => ({
        value: '',
        searchValues: [],
      }))
    } else if (prevState !== this.state) {
      this.state.value
        ? setSearchValues(this.props.category, [...this.state.searchValues, this.state.value])
        : setSearchValues(this.props.category, [...this.state.searchValues])
    }
  }

  render() {
    const { placeholder } = this.props
    const { value, searchValues } = this.state
    return (
      <>
        {searchValues.length > 0 && (
          <ul className="filter-chips">
            {searchValues.map((item: string, i: number) => (
              <li className="filter-chips-item" key={i}>
                {item}
                <button type="button" className="filter-chips-item-remove" onClick={() => this.removeItem(i)}>
                  <Icon icon={['fas', 'times']} props={{ size: 'sm' }} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="toolbar-search">
          <form className="toolbar-search-visible" onSubmit={this.setSearchValues}>
            <input
              className="toolbar-search-input"
              type="text"
              value={value}
              placeholder={placeholder || 'Фильтр'}
              onChange={e => {
                this.onInputData(e)
              }}
              ref={this.inputRef}
            />
            {value && (
              <button
                type="button"
                className="toolbar-search-clear-btn"
                onClick={() => {
                  this.clearInput()
                  this.inputRef.current!.focus()
                }}
              >
                <Icon icon={['fas', 'times']} props={{ size: 'xs' }} />
              </button>
            )}
            <button className="toolbar-search-filter" type="submit">
              <Icon icon={['fas', 'filter']} props={{ size: 'xs', className: 'toolbar-search-filter-icon' }} />
            </button>
          </form>
        </div>
      </>
    )
  }
}

export default ToolbarSearch
