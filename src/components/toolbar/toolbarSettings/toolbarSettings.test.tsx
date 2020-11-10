import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarSettings, mapStateToProps } from './toolbarSettings'
import { Link } from 'react-router-dom'

describe('ToolbarSettings tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    push: jest.fn()
  }
  const reduxPropsMock = {
    currentPath: '/path/'
  }
  const stateMock = {
    router: {
      location: {
        pathname: reduxPropsMock.currentPath
      }
    }
  }

  beforeEach(() => {
    component = shallow(<ToolbarSettings {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ currentPath: '/settings/common/' })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })

  it('calls the push func by clicking on Link', () => {
    component.find(Link).first().simulate('click')
    expect(ownPropsMock.push).toHaveBeenCalledTimes(1)
  })
})