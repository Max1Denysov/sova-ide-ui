import React, { PureComponent } from 'react'
import { HomeRoutePreload, LoginRoutePreload } from '../index'
import { Toolbar } from '../../components/toolbar/toolbar'
import EmptyComponent from '../../components/common/emptyComponent'
import { ReduxState } from '../../store/store'
import { connect } from 'react-redux'
import ScrollbarCustom from '../../components/common/customScrollbar'

interface ErrorRouteProps {
  errorMessage: string
}

interface ErrorRouteState {
  errorIsVisible: boolean
}

export class ErrorRoute extends PureComponent<ErrorRouteProps, ErrorRouteState> {
  state = {
    errorIsVisible: false
  }

  reloadInterval: any = null

  toggleError = () => this.setState(prevState => ({ errorIsVisible: !prevState.errorIsVisible }))

  componentDidMount() {
    HomeRoutePreload.preload()
    LoginRoutePreload.preload()

    this.reloadInterval = setInterval(() => window.location.reload(), 30000)
  }

  componentWillUnmount() {
    clearInterval(this.reloadInterval)
  }

  render() {
    const { errorMessage } = this.props
    const { errorIsVisible } = this.state
    return (
      <main className="with-error">
        <Toolbar toolbarFrame={EmptyComponent} toolbarIsHidden={true} toolbarUtility="" />
        <div className="workarea-empty-bg with-error">
          <span>
            Произошла ошибка!
            <br/>
            Перейдите в другой раздел
            <br/>
            или обновите страницу
          </span>
          {!!errorMessage && (
            <>
              <button onClick={this.toggleError}>
                {errorIsVisible ? 'Скрыть лог ошибки' : 'Показать лог ошибки'}
              </button>
              {errorIsVisible && (
                <div className="workarea-empty-error">
                  <ScrollbarCustom>
                    <ul>
                      {errorMessage.split(' in ').map((line, index) => {
                        return <li key={index}>{index ? '— in ' : ''}{line}</li>
                      })}
                    </ul>
                  </ScrollbarCustom>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  errorMessage: state.settings.get('errorMessage'),
})

export default connect(mapStateToProps)(ErrorRoute)