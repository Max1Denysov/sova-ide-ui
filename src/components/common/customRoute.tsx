import React, { PureComponent } from 'react'
import { Route, RouteProps } from 'react-router'
import { ReduxState } from '../../store/store'
import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import { NotFound } from '../../routes'

interface CustomRouteProps extends RouteProps {
  currentUserRole: string
  currentUserGroups: List<Map<any, any>>
  accessGroups?: List<string> | null
  forbiddenRoles?: List<string>
}

export class CustomRoute extends PureComponent<CustomRouteProps> {
  hasAccess = () => {
    if (this.props.currentUserRole === 'sys_admin' || this.props.currentUserRole === 'acc_admin') return true
    if (this.props.accessGroups === null) return false
    let access = false

    if (this.props.accessGroups && this.props.accessGroups.size) {
      this.props.currentUserGroups.forEach((group) => {
        if (this.props.accessGroups!.includes(group?.get('group_type'))) {
          access = true
          return false
        }
      })
    } else {
      access = true
    }

    if (this.props.forbiddenRoles && this.props.forbiddenRoles.size) {
      this.props.forbiddenRoles.forEach((role) => {
        if (this.props.currentUserRole === role) {
          access = false
          return false
        }
      })
    }

    return access
  }

  render() {
    return this.hasAccess() ? <Route {...this.props} /> : <NotFound />
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  currentUserRole: state.auth.getIn(['user', 'role', 'type']),
  currentUserGroups: state.auth.getIn(['user', 'groups']) || List(),
})

export default connect(mapStateToProps)(CustomRoute)
