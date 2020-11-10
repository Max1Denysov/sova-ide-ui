import React, { PureComponent } from 'react'
import { ReduxState } from '../../store/store'
import { connect } from 'react-redux'
import { setCustomConfirmConfig } from '../../store/dispatcher'
import { Map } from 'immutable'
import Icon from './icon'

export interface CustomConfirmData {
  active: boolean
  onConfirm(): void
  activeName: string
  title: string
}

interface CustomConfirmDataProps {
  data: Map<any, any>
  name: string
  style: {}
  theme?: 'light' | 'dark'
  isFrom?: 'top' | 'bottom' | 'left' | 'right'
}

interface CustomConfirmDataState {
  isReady: boolean
}

export class CustomConfirm extends PureComponent<CustomConfirmDataProps, CustomConfirmDataState> {
  state = {
    isReady: false,
  }

  rejectHandler = () => {
    this.setState(() => ({ isReady: false }))
    setTimeout(() => {
      setCustomConfirmConfig({
        active: false,
        onConfirm: () => {},
        activeName: '',
        title: '',
      })
    }, 300)
  }

  confirmHandler = () => {
    const onConfirm = this.props.data.get('onConfirm')
    this.rejectHandler()
    setTimeout(() => typeof onConfirm === 'function' && onConfirm(), 150)
  }

  componentDidMount() {
    if (this.props.name === this.props.data.get('activeName')) {
      setTimeout(() => this.setState(() => ({ isReady: true })), 100)
    }
  }

  componentDidUpdate(prevProps: Readonly<CustomConfirmDataProps>, prevState: Readonly<CustomConfirmDataState>) {
    if (prevProps.data !== this.props.data && this.props.name === this.props.data.get('activeName')) {
      setTimeout(() => this.setState(() => ({ isReady: true })), 100)
    }
  }

  componentWillUnmount() {
    this.rejectHandler()
  }

  render() {
    const { name, style, theme, isFrom, data } = this.props
    const { isReady } = this.state
    return data.get('active') && name === data.get('activeName') ? (
      <div
        className={`customConfirm-container${isReady ? ' is-ready' : ''}${theme ? ` is-${theme}` : ''}${
          isFrom ? ` is-from-${isFrom}` : ''
        }`}
        style={style}
      >
        <button className="customConfirm-btn is-reject" title="Отмена" onClick={this.rejectHandler}>
          <Icon icon={['fas', 'times']} props={{ size: 'lg' }} />
        </button>
        <button className="customConfirm-btn is-confirm" title={data.get('title')} onClick={this.confirmHandler}>
          <Icon icon={['fas', 'check']} props={{ size: 'lg' }} />
        </button>
      </div>
    ) : null
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  data: state.menu.get('customConfirm'),
})

export default connect(mapStateToProps)(CustomConfirm)
