import React from 'react'
import ToolbarControl from './toolbarControl/toolbarControl'
import ToolbarContent from './toolbarContent/toolbarContent'
import { connect } from 'react-redux'
import { ReduxState } from '../../store/store'
import ErrorBoundary from '../errorBoundary/errorBoundary'

interface ToolbarProps {
  toolbarFrame: React.ComponentType
  toolbarIsHidden: boolean
  toolbarUtility: string
}

export const Toolbar = React.memo<ToolbarProps>(({ toolbarFrame, toolbarIsHidden, toolbarUtility }) => (
  <aside className={`toolbar${toolbarIsHidden ? ' is-hidden' : ''}`}>
    <ToolbarControl/>
    <ErrorBoundary componentWithError="ToolbarWithError">
      <ToolbarContent toolbarFrame={toolbarFrame} isUtilityEnabled={!!toolbarUtility} />
    </ErrorBoundary>
  </aside>
))

export const mapStateToProps = (state: ReduxState) => ({
  toolbarIsHidden: state.toolbar.get('toolbarIsHidden'),
  toolbarUtility: state.toolbar.get('toolbarUtility'),
})

Toolbar.displayName = 'Toolbar'

export default connect(mapStateToProps)(Toolbar)
