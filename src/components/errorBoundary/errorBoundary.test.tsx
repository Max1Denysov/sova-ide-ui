import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ErrorBoundary from './errorBoundary'

describe('ErrorBoundary tests ', () => {
  let component: ShallowWrapper

  const propsMock = {
    componentWithError: 'MenuPanelWithError',
  }

  beforeEach(() => {
    // @ts-ignore
    component = shallow(<ErrorBoundary {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different state', () => {
    component.setState({ hasError: true })
    expect(component.exists()).toEqual(true)
  })
})
