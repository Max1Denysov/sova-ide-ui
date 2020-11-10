import React, { PureComponent } from 'react'
import { Switch, Route } from 'react-router'
import * as Routes from '../../routes/index'
import { connect } from 'react-redux'
import { ReduxState } from '../../store/store'
import CustomRoute from '../common/customRoute'
import { Home } from '../../routes'
import { List } from 'immutable'
import { DictionariesToolbar, SettingsToolbar, TemplatesToolbar } from '../toolbar/toolbarRoutes'
import { DictionariesFrame, SettingsFrame, TemplatesFrame, CompilationFrame } from '../workarea/workareaRoutes'
import EmptyComponent from '../common/emptyComponent'

interface SwitchAuthProps {
  isAuth: boolean
  hasError?: boolean
}

export class SwitchAuth extends PureComponent<SwitchAuthProps> {
  render() {
    const { isAuth, hasError } = this.props
    return isAuth ? (
      <>
        <Switch>
          {!!hasError && <Route component={Routes.Error} />}
          <CustomRoute
            path={['/', '/templates/']}
            exact
            render={() => <Home toolbarFrame={TemplatesToolbar} workareaFrame={TemplatesFrame} />}
            forbiddenRoles={List(['acc_demo'])}
          />

          <CustomRoute
            path={['/dictionaries/']}
            render={() => <Home toolbarFrame={DictionariesToolbar} workareaFrame={DictionariesFrame} />}
            forbiddenRoles={List(['acc_demo'])}
          />
          <CustomRoute
            path={['/settings/']}
            render={() => <Home toolbarFrame={SettingsToolbar} workareaFrame={SettingsFrame} />}
          />

          <CustomRoute
            path={['/compilation/']}
            render={() => <Home toolbarFrame={EmptyComponent} workareaFrame={CompilationFrame} renderAccountsList />}
            forbiddenRoles={List(['acc_demo'])}
          />
          <Route component={Routes.NotFound} />
        </Switch>
      </>
    ) : (
      <Route component={Routes.Login} />
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  isAuth: state.auth.get('isAuth'),
})

export default connect(mapStateToProps)(SwitchAuth)
