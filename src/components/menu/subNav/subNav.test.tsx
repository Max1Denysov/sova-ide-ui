import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { SubNav } from './subNav'
import { Link } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { history, store } from '../../../store/store'
import { Provider } from 'react-redux'
import { logoutUser } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('SubNav tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    data: [
      [
        {
          title: 'TITLE',
          path: '/path/',
          action: 'logout'
        }
      ],
    ],
    push: jest.fn(),
    hideSelection: jest.fn(),
  }

  beforeEach(() => {
    component = shallow(<SubNav {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the right funcs on clicking Link', () => {
    const mounted = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <SubNav {...propsMock} />
        </ConnectedRouter>
      </Provider>
    )

    mounted.find(Link).first().simulate('click')
    expect(propsMock.push).toHaveBeenCalledTimes(1)
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })
})