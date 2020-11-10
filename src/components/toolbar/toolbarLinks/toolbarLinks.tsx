import React from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { links } from '../../../routes/configs/toolbarConfig'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import { ReduxState } from '../../../store/store'
import { toolbarIsHidden } from '../../../store/dispatcher'

interface ToolbarLinksProps {
  currentPath: string
  push?(link: string): void
  currentUserRole: string
  toolbarStatus: boolean
}

export const ToolbarLinks = React.memo<ToolbarLinksProps>(({ currentPath, push, currentUserRole, toolbarStatus }) => {
  return (
    <div className="toolbar-links-wrapper">
      <ul className="toolbar-links">
        {links.map((el, index) => {
          const Item = () => (
            <li>
              <Link
                onClick={() => {
                  push && push(el.link)
                  if (toolbarStatus) toolbarIsHidden(false)
                }}
                to={el.link}
                className={`toolbar-link${
                  currentPath === '/' 
                    ? currentPath === el.link ? ' active' : '' 
                    : el.link !== '/' ? (currentPath.includes(el.link) ? ' active' : '') : '' 
                }`}
                title={el.name}
              >
                {el.icon && <Icon icon={el.icon} props={el.iconProps} />}
              </Link>
            </li>
          )

          return <Item key={index} />
        })}
      </ul>
    </div>
  )
})

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
  currentUserRole: state.auth.getIn(['user', 'role', 'type']),
  toolbarStatus: state.toolbar.get('toolbarIsHidden'),
})

ToolbarLinks.displayName = 'ToolbarLinks'

export default connect(
  mapStateToProps,
  { push }
)(ToolbarLinks)
