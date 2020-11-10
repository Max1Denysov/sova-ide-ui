import React from 'react'
import { connect } from 'react-redux'
import { settingsLinks } from '../../../routes/configs/toolbarConfig'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { ReduxState } from '../../../store/store'

interface ToolbarSettingsProps {
  currentPath: string
  push?(link: string): void
}

export const ToolbarSettings = React.memo<ToolbarSettingsProps>(props =>
  <ul className="toolbar-settings">
    {settingsLinks.map((el, index) => {
      return (
        <li key={index}>
          <Link
            onClick={() => props.push && props.push(el.link)}
            to={el.link}
            className={`toolbar-settings-link${props.currentPath === el.link ? ' active' : ''}`}
            title={el.name}
          >
            {el.name}
          </Link>
        </li>
      )
    })}
  </ul>
)

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
})

ToolbarSettings.displayName = 'ToolbarSettings'

export default connect(
  mapStateToProps,
  { push }
)(ToolbarSettings)
