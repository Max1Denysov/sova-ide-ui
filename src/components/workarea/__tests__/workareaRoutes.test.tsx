import React from 'react'
import { shallow } from 'enzyme'
import {
  TemplatesFrame,
  DictionariesFrame,
  SettingsFrame,
} from '../workareaRoutes'

describe('WorkareaRoutes tests', () => {
  it('*UNIT* renders without crashing', () => {
    const component = shallow(<TemplatesFrame/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<DictionariesFrame/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<SettingsFrame/>)
    expect(component.exists()).toEqual(true)
  })
})