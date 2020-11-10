import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarLinks, mapStateToProps } from './toolbarLinks'
import { Map, fromJS } from 'immutable'

describe('ToolbarLinks tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    push: jest.fn(),
  }
  const reduxPropsMock = {
    currentPath: '/path/',
    currentUserRole: 'userRole',
    toolbarStatus: true,
  }
  const stateMock = {
    router: {
      location: {
        pathname: reduxPropsMock.currentPath
      }
    },
    toolbar: Map({
      toolbarIsHidden: reduxPropsMock.toolbarStatus
    }),
    auth: Map(fromJS({
      user: {
        role: {
          type: reduxPropsMock.currentUserRole
        }
      }
    }))
  }

  beforeEach(() => {
    component = shallow(<ToolbarLinks {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})