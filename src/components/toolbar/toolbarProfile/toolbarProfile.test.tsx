import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarProfile, mapStateToProps } from './toolbarProfile'
import { Map, fromJS } from 'immutable'

describe('ToolbarProfile tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    toolbarIsHidden: false,
    currentPath: '/path/',
  }
  const stateMock = {
    toolbar: Map(fromJS({
      toolbarIsHidden: propsMock.toolbarIsHidden
    })),
    router: {
      location: {
        pathname: propsMock.currentPath
      }
    }
  }

  beforeEach(() => {
    component = shallow(<ToolbarProfile {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})