import React from 'react'
import { shallow } from 'enzyme'
import {
  DefaultToolbar,
  TemplatesToolbar,
  DictionariesToolbar,
  SettingsToolbar,
  mapStateToProps,
} from './toolbarRoutes'
import { Map, fromJS } from 'immutable'

describe('ToolbarRoutes tests', () => {
  const propsMock = {
    toolbarIsHidden: false
  }
  const stateMock = {
    toolbar: Map(fromJS(propsMock))
  }

  it('*UNIT* renders without crashing', () => {
    const component = shallow(
      <DefaultToolbar {...propsMock}>
        <div>TEST</div>
      </DefaultToolbar>
    )
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<TemplatesToolbar/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<DictionariesToolbar/>)
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const component = shallow(<SettingsToolbar/>)
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})