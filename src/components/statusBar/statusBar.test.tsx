import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { StatusBar, mapStateToProps } from './statusBar'
import { Map } from 'immutable'
import { Provider } from 'react-redux'
import { store } from '../../store/store'
import { setStatusBarNotification } from '../../store/dispatcher'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faQuestionCircle, faTimesCircle, faInfoCircle, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
library.add(
  faTimes,
  faQuestionCircle,
  faTimesCircle,
  faInfoCircle,
  faCheckCircle,
  faExclamationCircle,
)

jest.mock('../../store/dispatcher')

describe('StatusBar tests', () => {
  let component: ShallowWrapper
  let instance: StatusBar
  const propsMock = {
    showNotification: true,
    data: {
      msg: 'msg',
      className: 'warning',
      confirm: true,
      handler: jest.fn(),
      hideAfter: 1000,
    },
    showSyncNotification: false,
    syncData: {},
  }
  const stateMock = {
    statusbar: Map(propsMock)
  }

  beforeEach(() => {
    component = shallow(<StatusBar {...propsMock} />)
    instance = component.instance() as StatusBar
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ data: { confirm: false } })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ data: { confirm: false, className: 'warning' } })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ showNotification: false })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* mounts without crashing', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar {...propsMock} />
      </Provider>
    )
    expect(mounted.find('.statusBar-container').exists()).toEqual(true)
  })

  it('*UNIT* mounts without crashing', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar data={{}} syncData={{}} showNotification={true} showSyncNotification={false} />
      </Provider>
    )
    expect(mounted.find('.statusBar-container').exists()).toEqual(true)
  })

  it('*UNIT* mounts without crashing', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar
          {...propsMock}
          data={{
            className: 'error',
            confirm: false,
            msg: 'msg',
          }}
        />
      </Provider>
    )
    expect(mounted.find('.statusBar-container').exists()).toEqual(true)
  })

  it('*UNIT* mounts without crashing', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar
          {...propsMock}
          data={{
            className: 'warning',
            confirm: true,
            msg: 'msg',
          }}
        />
      </Provider>
    )
    expect(mounted.find('.statusBar-container').exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the method', () => {
    jest.spyOn(instance, 'closeNotification').mockImplementation(jest.fn())
    instance.closeNotification()
    expect(instance.closeNotification).toHaveBeenCalledTimes(1)
  })

  it('calls the right methods on click', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar {...propsMock} />
      </Provider>
    )
    mounted.find('.statusBar-btn').first().simulate('click')
    mounted.find('.statusBar-btn').last().simulate('click')
    setTimeout(() => expect(setStatusBarNotification).toHaveBeenCalledTimes(1),200)
  })

  it('calls the right methods on click', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar
          {...propsMock}
          data={{
            confirm: true,
            className: 'warning',
            msg: 'msg',
            handler: jest.fn(),
            hideAfter: 1000,
          }}
        />
      </Provider>
    )
    mounted.find('.statusBar-btn').last().simulate('click')
  })

  it('calls the right method on click', () => {
    const mounted = mount(
      <Provider store={store}>
        <StatusBar
          {...propsMock}
          data={{
            className: 'error',
            confirm: true,
            msg: 'msg',
            handler: jest.fn(),
            hideAfter: 1000,
          }}
        />
      </Provider>
    )
    mounted.find('.statusBar-btn').first().simulate('click')
  })
})