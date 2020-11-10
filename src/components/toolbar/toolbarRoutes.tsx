import React, { ReactNode } from 'react'
import ToolbarCategories from './toolbarCategories/toolbarCategories'
import ToolbarSettings from './toolbarSettings/toolbarSettings'
import ToolbarDictionaries from './toolbarDictionaries/toolbarDictionaries'
import { connect } from 'react-redux'
import { ReduxState } from '../../store/store'

interface ToolbarContentProps {
  toolbarIsHidden: boolean
  children?: ReactNode
}

export const DefaultToolbar = React.memo<ToolbarContentProps>(({ toolbarIsHidden, children }) => (
  <>{!toolbarIsHidden && <div className="toolbar-content-wrapper">{children}</div>}</>
))

export const mapStateToProps = (state: ReduxState) => ({
  toolbarIsHidden: state.toolbar.get('toolbarIsHidden'),
})

const DefaultLayoutToolbar = connect(mapStateToProps)(DefaultToolbar)

export const TemplatesToolbar = React.memo(() => (
  <DefaultLayoutToolbar>
    <ToolbarCategories />
  </DefaultLayoutToolbar>
))

export const DictionariesToolbar = React.memo(() => (
  <DefaultLayoutToolbar>
    <ToolbarDictionaries />
  </DefaultLayoutToolbar>
))

export const SettingsToolbar = React.memo(() => (
  <DefaultLayoutToolbar>
    <ToolbarSettings />
  </DefaultLayoutToolbar>
))

DictionariesToolbar.displayName = 'DictionariesToolbar'
