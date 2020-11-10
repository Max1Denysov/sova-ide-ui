import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { DefaultLayout, mapStateToProps } from './defaultLayout'
import { Map, fromJS } from 'immutable'

describe('DefaultLayout tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    currentTheme: 'theme1',
    animationEnabled: true,
  }
  const stateMock = {
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                colorTheme: {
                  value: {
                    value: propsMock.currentTheme,
                  },
                },
                animationEnabled: {
                  value: propsMock.animationEnabled,
                },
              },
            },
          },
        },
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<DefaultLayout {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ animationEnabled: false })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
