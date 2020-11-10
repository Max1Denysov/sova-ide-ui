import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'
import SwitchAuth from './components/switchAuth/switchAuth'
import { store, history, persistor } from './store/store'
import { ConnectedRouter } from 'connected-react-router'

import './icons/fontawesome'
import ErrorBoundary from './components/errorBoundary/errorBoundary'

class App extends Component {
  render() {
    return (
      <ErrorBoundary componentWithError="AppWithError">
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ConnectedRouter history={history}>
              <Router history={history}>
                <SwitchAuth />
              </Router>
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    )
  }
}

export default App
