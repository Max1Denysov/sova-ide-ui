import React, { PureComponent } from 'react'
import Icon from './icon'

interface CustomInputProps {
  group?: string
  id?: string
  value?: string
  updateValue?(group: string, settings: string, id: string, value: string): void
  onSubmit?(value: string): void
  disabled: boolean
  clearOnSubmit?: boolean
  defaultPlaceholder?: string
}

class CustomInput extends PureComponent<CustomInputProps> {
  state = {
    value: this.props.value || '',
  }

  onChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: ev.currentTarget.value })
  }

  onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (this.props.group && this.props.id && typeof this.props.updateValue === 'function') {
      this.props.updateValue(this.props.group, 'params', this.props.id, this.state.value)
    }

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.value)
    }

    if (this.props.clearOnSubmit) {
      this.setState(() => ({ value: '' }))
    }
  }

  restoreValue = () => this.setState(() => ({ value: this.props.value }))

  componentDidUpdate(prevProps: Readonly<CustomInputProps>) {
    if (prevProps.value !== this.props.value) {
      this.setState(() => ({ value: this.props.value }))
    }
  }

  render() {
    const { id, value, defaultPlaceholder, disabled } = this.props
    return (
      <form className="custom-input" onSubmit={this.onSubmit}>
        <input
          type="text"
          id={id}
          value={this.state.value}
          onChange={this.onChange}
          placeholder={defaultPlaceholder || ''}
          disabled={disabled}
        />
        {value !== this.state.value && (
          <>
            <span onClick={this.restoreValue} title="Отменить изменения">
              <Icon icon={['fas', 'ban']} props={{ size: 'lg' }} />
            </span>
            <button type="submit" title="Сохранить изменения">
              <Icon icon={['far', 'save']} props={{ size: 'lg' }} />
            </button>
          </>
        )}
      </form>
    )
  }
}

export default CustomInput
