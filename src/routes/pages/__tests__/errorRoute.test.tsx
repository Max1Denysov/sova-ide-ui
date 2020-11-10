import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { ErrorRoute, mapStateToProps } from '../errorRoute'
import { Map, fromJS } from 'immutable'
import { history, store } from '../../../store/store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from "connected-react-router"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faBook, faCodeBranch } from '@fortawesome/free-solid-svg-icons'
import { faFileAlt } from '@fortawesome/free-regular-svg-icons'
library.add(faUserCircle, faBook, faCodeBranch, faFileAlt)

describe('ErrorRoute tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    errorMessage: ''
  }
  const stateMock = {
    settings: Map(fromJS(propsMock))
  }

  beforeEach(() => {
    component = shallow(<ErrorRoute {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ errorMessage: 'test in test in test' })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const mounted = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ErrorRoute {...propsMock} />
        </ConnectedRouter>
      </Provider>
    )
    expect(mounted.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const mounted = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ErrorRoute errorMessage="test in test in test" />
        </ConnectedRouter>
      </Provider>
    )
    expect(mounted.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('clears interval on unmount', () => {
    component.unmount()
  })
})