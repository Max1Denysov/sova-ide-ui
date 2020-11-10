import React from 'react'
import { connect } from 'react-redux'
import { showToolbarUtility, toolbarIsHidden } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'

interface MenuLogoProps {
  isHidden: boolean
  toolbarUtility: string
}

export const MenuLogo = React.memo<MenuLogoProps>(({ isHidden, toolbarUtility }) => {
  return (
    <button
      className={`menu-logo-link${!isHidden ? ' active' : ''}${!!toolbarUtility ? ' utility' : ''}`}
      onClick={() => !!toolbarUtility ? showToolbarUtility('') : toolbarIsHidden(!isHidden)}
      title={!!toolbarUtility ? 'Закрыть утилиту' : (!isHidden ? 'Закрыть тулбар' : 'Открыть тулбар')}
    >
      <span/>
    </button>
  )
})

export const mapStateToProps = (state: ReduxState) => ({
  isHidden: state.toolbar.get('toolbarIsHidden'),
  toolbarUtility: state.toolbar.get('toolbarUtility'),
})

MenuLogo.displayName = 'MenuLogo'

export default connect(mapStateToProps)(MenuLogo)
