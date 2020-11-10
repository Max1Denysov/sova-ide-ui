import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Icon from '../common/icon'
import { setStatusBarNotification, setStatusBarSyncing } from '../../store/dispatcher'
import { ReduxState } from '../../store/store'

export interface StatusBarDataProps {
  msg?: string
  className?: string
  confirm?: boolean
  handler?(): void
  hideAfter?: number
}

interface StatusBarProps {
  showNotification: boolean
  data: StatusBarDataProps
  syncOnly?: boolean
  showSyncNotification: boolean
  syncData: StatusBarDataProps
}

export class StatusBar extends PureComponent<StatusBarProps> {
  closeNotification = () => {
    if (this.props.syncOnly) {
      setStatusBarSyncing(this.props.syncData, false)
    } else {
      setStatusBarNotification(this.props.data, false)
    }
  }

  handleConfirm = (handler: () => void) => {
    handler()
    this.closeNotification()
  }

  checkTimeout = () => {
    if (this.props.data.hideAfter && this.props.showNotification) {
      setTimeout(this.closeNotification, this.props.data.hideAfter)
    }
  }

  componentDidMount() {
    this.checkTimeout()
  }

  componentDidUpdate() {
    this.checkTimeout()
  }

  render() {
    const { showNotification, showSyncNotification, syncOnly, syncData } = this.props
    const data: StatusBarDataProps =
      Object.assign({}, syncOnly ? (syncData || {}) : (this.props.data || {}))
    const icon =
      data.confirm
        ? 'question-circle'
        : data.className === 'error' || data.className === 'warning'
          ? 'exclamation-circle'
          : 'info-circle'
    return (
      <div
        className={`statusBar-container${data.className ? ` ${data.className}` : ''}${syncOnly ? ' sync' : ''}${
          data.confirm ? ' confirm' : ''}${(syncOnly ? showSyncNotification : showNotification) ? '' : ' is-hidden'}`
        }
      >
        <div className="statusBar-icon">
          <Icon icon={['fas', icon]} props={{ size: '2x' }}/>
        </div>
        <span dangerouslySetInnerHTML={{ __html: data.msg || '' }}/>
        {((data.className === 'error' && !data.confirm) || syncOnly) && (
          <button className="statusBar-hide" onClick={this.closeNotification}>
            <Icon icon={['fas', 'times']} props={{ size: 'lg' }}/>
          </button>
        )}
        {data.confirm && (
          <div className="statusBar-buttons">
            {data.handler && typeof data.handler === 'function' && (
              <button className="statusBar-btn" onClick={() => this.handleConfirm(data.handler!)}>
                <Icon icon={['fas', 'check-circle']} props={{ size: '2x' }}/>
              </button>
            )}
            <button className="statusBar-btn" onClick={this.closeNotification}>
              <Icon icon={['fas', 'times-circle']} props={{ size: '2x' }}/>
            </button>
          </div>
        )}
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  showNotification: state.statusbar.get('showNotification'),
  data: state.statusbar.get('data'),
  showSyncNotification: state.statusbar.get('showSyncNotification'),
  syncData: state.statusbar.get('syncData'),
})

export default connect(mapStateToProps)(StatusBar)
