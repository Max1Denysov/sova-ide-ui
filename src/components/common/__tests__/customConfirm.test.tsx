import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { CustomConfirm, mapStateToProps } from '../customConfirm'
import { Map, fromJS } from 'immutable'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCheck, faTimes)

describe('CustomConfirm test', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    name: 'activeName',
    style: {},
    theme: 'light',
    isFrom: 'top',
  }

  const propsMock = {
    data: Map(
      fromJS({
        active: true,
        activeName: 'activeName',
        title: 'text',
        onConfirm: jest.fn(),
      })
    ),
  }

  const stateMock = {
    menu: Map({
      customConfirm: propsMock.data,
    }),
  }

  beforeEach(() => {
    component = shallow(
      <Provider store={store}>
        <CustomConfirm {...propsMock} {...ownPropsMock} />
      </Provider>
    )
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CustomConfirm {...propsMock} {...ownPropsMock} />
      </Provider>
    )
    expect(wrapper.find('.customConfirm-container').length).toBe(1)
  })

  /* it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ name: 'active', style: {}, theme: 'light', isFrom: 'top' })
    expect(component.exists()).toEqual(true)
  }) */

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
