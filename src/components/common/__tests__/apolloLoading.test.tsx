import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ApolloLoading from '../apolloLoading'

describe('ApolloLoading tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<ApolloLoading/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})