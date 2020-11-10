import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { store, history, persistor } from '../store/store'
import App from '../App'

it('*UNIT* App renders without crashing', () => {
  const component = shallow(<App />)
  expect(component.exists()).toEqual(true)
})

it('*UNIT* ReduxStore renders without crashing', () => {
  const component = shallow(<Provider store={store} />)
  expect(component.exists()).toEqual(true)
})

it('*UNIT* Persistor renders without crashing', () => {
  const component = shallow(<PersistGate persistor={persistor} />)
  expect(component.exists()).toEqual(true)
})

it('*UNIT* ConnectedRouter renders without crashing', () => {
  const component = shallow(
    <Provider store={store}>
      <ConnectedRouter history={history} />
    </Provider>
  )
  expect(component.containsMatchingElement(<ConnectedRouter history={history} />)).toEqual(true)
})

it('*UNIT* Router renders without crashing', () => {
  const component = shallow(<Router />)
  expect(component.exists()).toEqual(true)
})
