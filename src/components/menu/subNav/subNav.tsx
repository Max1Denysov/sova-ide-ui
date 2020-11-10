import React from 'react'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { logoutUser, showToolbarUtility } from '../../../store/dispatcher'

interface SubNavProps {
  data: {
    title: string,
    path: string,
    action?: string
  }[][]
  push?(link: string): void
  hideSelection(): void
}

export const SubNav = React.memo<SubNavProps>(({ data, push, hideSelection }) => {
  const utilities: { [key: string]: () => void } = {
    replace: () => {
      showToolbarUtility('replace')
      hideSelection()
    }
  }

  return (
    <>
      {data.map((item, idx) => (
        <li className="subnav-item" key={idx}>
          <ul className="subnav-list">
            {item.map((itemLevel2, idx) => {
              return (
                <li className="subnav-item" key={idx}>
                  {itemLevel2.path.startsWith('#') ? (
                    <button
                      className="subnav-link"
                      onClick={() => utilities[itemLevel2.path.slice(1)]()}
                    >
                      {itemLevel2.title}
                    </button>
                  ) : (
                    <Link
                      className="subnav-link"
                      to={itemLevel2.path}
                      onClick={() => {
                        push && push(itemLevel2.path)
                        hideSelection()
                        itemLevel2.action === 'logout' && logoutUser()
                      }}
                    >
                      {itemLevel2.title}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </>
  )
})

SubNav.displayName = 'SubNav'

export default connect(
  null,
  { push }
)(SubNav)
