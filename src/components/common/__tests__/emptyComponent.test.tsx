import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import EmptyComponent from '../emptyComponent'

describe('EmptyComponent tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<EmptyComponent/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})