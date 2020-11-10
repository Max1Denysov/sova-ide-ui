import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import withArrowNavigation from './withArrowNavigation'

describe('WithArrowNavigation test', () => {
  let component: ShallowWrapper
  let instance: withArrowNavigation

  const propsMock = {
    data: [],
    onSelectDropDownItem: jest.fn(),
  }

  beforeEach(() => {
    component = shallow(<withArrowNavigation {...propsMock} />)
    instance = component.instance() as withArrowNavigation
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})
