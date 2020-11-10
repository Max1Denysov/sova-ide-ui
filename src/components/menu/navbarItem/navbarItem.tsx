import React, { PureComponent } from 'react'
import SubNav from '../subNav/subNav'
import OutBoundClick from '../../outboundClick/outBoundClick'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import MenuQuickSettings from '../menuQuickSettings/menuQuickSettings'

interface NavbarItemProps {
  subNav?: {
    title: string
    path: string
    action?: string
  }[][]
  path?: string
  quickSettings?: boolean
  title: string
  clicked: boolean
  activeItem: number
  setActiveItem(id: number): void
  handleClick(value: boolean): void
  id: number
  push?(link: string): void
}

interface NavbarItemState {
  isDropDown: boolean
}

export class NavbarItem extends PureComponent<NavbarItemProps, NavbarItemState> {
  state = {
    isDropDown: false,
  }

  setDropDown = (isDropDown: boolean) => {
    this.setState({
      isDropDown,
    })
  }

  outBoundClick = () => {
    if (this.props.clicked) {
      this.props.handleClick(false)
    }
  }

  componentDidUpdate(prevProps: Readonly<NavbarItemProps>) {
    if (prevProps.activeItem !== this.props.activeItem) {
      this.setDropDown(this.props.activeItem === this.props.id)
    }

    if (prevProps.clicked !== this.props.clicked) {
      if (this.props.id === this.props.activeItem) {
        this.setDropDown(this.props.clicked)
      }
    }
  }

  render() {
    const { clicked, title, subNav, path, quickSettings, setActiveItem, handleClick, id, push } = this.props
    const { isDropDown } = this.state
    const linkClass = isDropDown ? 'navbar-link active' : 'navbar-link'
    return (
      <li
        className="navbar-item"
        onMouseEnter={() => clicked && setActiveItem(id)}
      >
        {(subNav && subNav.length) || quickSettings ? (
          <>
            <span
              className={linkClass}
              onClick={() => {
                handleClick(!clicked)
                !clicked && setActiveItem(id)
              }}
            >
              {title}
            </span>
            {isDropDown && (
              <OutBoundClick onClick={this.outBoundClick} exceptions={['subnav-link']}>
                <div className={`subnav-dropdown${quickSettings ? ' quick-settings' : ''}`}>
                  <ul className="subnav">
                    {subNav && subNav.length ? (
                      <SubNav data={subNav} hideSelection={this.outBoundClick} />
                    ) : quickSettings && (
                      <MenuQuickSettings settingsRoute="common" settingsGroup="visual" />
                    )}
                  </ul>
                </div>
              </OutBoundClick>
            )}
          </>
        ) : !!path && (
          <Link
            to={path}
            onClick={() => push && push(path)}
            className={linkClass}
          >
            {title}
          </Link>
        )}
      </li>
    )
  }
}

export default connect(null, { push })(NavbarItem)
