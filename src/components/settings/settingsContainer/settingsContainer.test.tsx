import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import SettingsContainer from './settingsContainer'

describe('SettingsContainer tests', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<SettingsContainer/>)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})