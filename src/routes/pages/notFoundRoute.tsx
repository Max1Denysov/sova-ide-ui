import React, { PureComponent } from 'react'
import Menu from '../../components/menu/menu'
import StatusBar from '../../components/statusBar/statusBar'
import { HomeRoutePreload, LoginRoutePreload } from '../index'
import { Toolbar } from '../../components/toolbar/toolbar'
import EmptyComponent from '../../components/common/emptyComponent'

class NotFoundRoute extends PureComponent {
  componentDidMount() {
    HomeRoutePreload.preload()
    LoginRoutePreload.preload()
  }

  render() {
    return (
      <>
        <Menu/>
        <main>
          <Toolbar toolbarFrame={EmptyComponent} toolbarIsHidden={true} toolbarUtility="" />
          <main>
            <div className="workarea-empty-bg">
              Ошибка 404:
              <br/>
              Страница
              <br/>
              не найдена
            </div>
          </main>
        </main>
        <StatusBar/>
      </>
    )
  }
}

export default NotFoundRoute
