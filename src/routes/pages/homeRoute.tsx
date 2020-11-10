import React, { PureComponent } from 'react'
import Menu from '../../components/menu/menu'
import Toolbar from '../../components/toolbar/toolbar'
import Workarea from '../../components/workarea/workarea'
import ErrorBoundary from '../../components/errorBoundary/errorBoundary'

interface HomeRouteProps {
  toolbarFrame: React.ComponentType
  workareaFrame: React.ComponentType
  renderAccountsList: boolean
  isChatDisabled?: boolean
}

class HomeRoute extends PureComponent<HomeRouteProps> {
  render() {
    const { toolbarFrame, workareaFrame, renderAccountsList, isChatDisabled } = this.props
    return (
      <>
        <ErrorBoundary componentWithError="MenuWithError">
          <Menu renderAccountsList={renderAccountsList} isChatDisabled={isChatDisabled} />
        </ErrorBoundary>
        <main>
          <Toolbar toolbarFrame={toolbarFrame} />
          <ErrorBoundary componentWithError="WorkAreaWithError">
            <Workarea workareaFrame={workareaFrame} isChatDisabled={isChatDisabled} />
          </ErrorBoundary>
        </main>
      </>
    )
  }
}

export default HomeRoute
