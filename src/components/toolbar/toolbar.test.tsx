import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Toolbar, mapStateToProps } from './toolbar'
import { Map, fromJS } from 'immutable'

describe('Toolbar tests', () => {
  let component: ShallowWrapper
  const compMock = React.memo(() => <div>TEST</div>)
  const ownPropsMock = {
    toolbarFrame: compMock,
  }
  const reduxPropsMock = {
    toolbarIsHidden: false,
    toolbarUtility: '',
  }
  const stateMock = {
    toolbar: Map(fromJS(reduxPropsMock))
  }

  beforeEach(() => {
    component = shallow(<Toolbar {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ toolbarIsHidden: true })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})