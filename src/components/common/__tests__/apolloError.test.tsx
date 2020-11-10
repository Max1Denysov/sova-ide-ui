import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ApolloError from '../apolloError'

describe('ApolloError tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    errorMsg: 'errorMsg'
  }

  beforeEach(() => {
    component = shallow(<ApolloError {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})