import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { TransitionCustom, mapStateToProps } from '../customTransition'
import { Map, fromJS } from 'immutable'

describe('TransitionCustom tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    items: true,
  }
  const reduxPropsMock = {
    animationEnabled: true,
  }
  const stateMock = {
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                animationEnabled: {
                  value: reduxPropsMock.animationEnabled,
                },
              },
            },
          },
        },
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<TransitionCustom {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      animationEnabled: false,
      items: false,
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})
