import React from 'react'
import MenuLogo from './menuLogo/menuLogo'
import MenuPanel from './menuPanel/menuPanel'
import Navbar from './navbar/navbar'
import MenuCompilationPanel from './menuCompilationPanel/menuCompilationPanel'
import MenuCompilationInfo from './menuCompilationInfo/menuCompilationInfo'
import ErrorBoundary from '../errorBoundary/errorBoundary'

interface MenuProps {
  renderAccountsList?: boolean
  isChatDisabled?: boolean
}

const Menu = React.memo<MenuProps>(({ renderAccountsList }) => {
  return (
    <header className="menu">
      <MenuLogo />
      <div className="w-full h-full">
        <div className="menu-panel-container">
          <Navbar />
          <ErrorBoundary componentWithError="MenuCompilationInfoWithError">
            <MenuCompilationInfo />
          </ErrorBoundary>
        </div>
        <div className="menu-panel-container">
          <ErrorBoundary componentWithError="MenuPanelWithError">
            <MenuPanel renderAccountsList={!!renderAccountsList} />
          </ErrorBoundary>
          <MenuCompilationPanel />
        </div>
      </div>
    </header>
  )
})

Menu.displayName = 'Menu'

export default Menu
