import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import Menu from './menu'
import { Map } from 'immutable'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { store, history } from '../../store/store'
import { Router } from 'react-router-dom'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCaretDown)

describe('Menu tests', () => {
  let component: ShallowWrapper

  const propsMock = {
    renderAccountsList: true,
    isChatDisabled: true,
    currentUser: Map(),
  }

  beforeEach(() => {
    component = shallow(<Menu {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      currentUser: Map({
        uuid: '2f5fa591-aa58-401b-ba5d-81bec623c791',
      }),
    })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders loading text on loading state', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <MockedProvider mocks={[]}>
          <Provider store={store}>
            <Router history={history}>
              <Menu {...propsMock} />
            </Router>
          </Provider>
        </MockedProvider>
      )
      expect(mounted.find('.dot-loader').exists()).toEqual(false)
    })
  })
})
