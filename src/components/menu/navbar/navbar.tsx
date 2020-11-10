import React, { useState } from 'react'
import { initialData } from '../../../routes/configs/menuConfig'
import NavbarItem from '../navbarItem/navbarItem'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'

interface NavbarProps {
  currentUserRole: string
}

export const Navbar = React.memo<NavbarProps>(({ currentUserRole }) => {
  const [clicked, handleClick] = useState(false)
  const [activeItem, setActiveItem] = useState(-1)
  const isAllowed = currentUserRole !== 'acc_demo'
  return (
    <nav className="main-nav">
      <ul className="navbar">
        {initialData.map((item, idx) => {
          if (item.path && item.path.includes('compilation') && !isAllowed) return null
          return (
            <NavbarItem
              clicked={clicked}
              key={idx}
              id={idx}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              handleClick={handleClick}
              title={item.title}
              subNav={item.subNav}
              path={item.path}
              quickSettings={item.quickSettings}
            />
          )
        })}
      </ul>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export const mapStateToProps = (state: ReduxState) => ({
  currentUserRole: state.auth.getIn(['user', 'role', 'type']),
})

export default connect(mapStateToProps)(Navbar)
