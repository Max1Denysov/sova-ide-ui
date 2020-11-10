import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { logoutUser } from '../../../store/dispatcher'
import Icon from '../../common/icon'
import { animated } from 'react-spring/renderprops'
import { menuLinks } from '../../../routes/configs/toolbarConfig'
import { push } from 'connected-react-router'
import { Link } from 'react-router-dom'
import TransitionCustom from '../../common/customTransition'
import { ReduxState } from '../../../store/store'
import OutBoundClick from '../../outboundClick/outBoundClick'

interface ToolbarProfileProps {
  push?(link: string): void
  currentPath: string
  toolbarIsHidden: boolean
}

interface ToolbarProfileState {
  menuIsActive: boolean
}

export class ToolbarProfile extends PureComponent<ToolbarProfileProps, ToolbarProfileState> {
  state = {
    menuIsActive: false,
  }

  toggleMenu = (value: boolean) => this.setState(() => ({ menuIsActive: value }))

  render() {
    const { push } = this.props
    const { menuIsActive } = this.state
    return (
      <OutBoundClick onClick={() => menuIsActive && this.toggleMenu(false)} exceptions={['toolbar-avatar']}>
        <div className="toolbar-profile">
          <button className="toolbar-avatar" onClick={() => this.toggleMenu(!menuIsActive)}>
            <Icon icon={['fas', 'user-circle']} props={{ size: '3x' }} />
          </button>
          <TransitionCustom
            config={{ tension: 200, friction: 26 }}
            from={{ transform: 'translateY(110%)' }}
            enter={{ transform: 'translateY(0)' }}
            leave={{ transform: 'translateY(110%)' }}
            items={menuIsActive}
            initial={null}
            unique
            native
          >
            {(menuIsActive: boolean) =>
              menuIsActive &&
              ((styles) => (
                <animated.ul style={styles} className="toolbar-menu">
                  {menuLinks.map((el, index) => (
                    <li key={index}>
                      <Link
                        to={el.link}
                        className={`toolbar-menu-link${this.props.currentPath === el.link ? ' active' : ''}`}
                        title={el.name}
                        onClick={() => {
                          push && push(el.link)
                          this.toggleMenu(!menuIsActive)
                          if (el.link === '/') logoutUser()
                        }}
                      >
                        {!!el.icon && <Icon icon={el.icon} props={el.iconProps} />}
                      </Link>
                    </li>
                  ))}
                </animated.ul>
              ))
            }
          </TransitionCustom>
        </div>
      </OutBoundClick>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
  toolbarIsHidden: state.toolbar.get('toolbarIsHidden'),
})

export default connect(mapStateToProps, { push })(ToolbarProfile)
