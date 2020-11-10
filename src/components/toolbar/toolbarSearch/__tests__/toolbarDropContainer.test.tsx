import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import ToolbarDropContainer from '../toolbarDropContainer'

describe('ToolbarDropContainer tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    setDropDown: jest.fn(),
    onSelectDropDownItem: jest.fn(),
    data: [{
      name: 'name',
      id: 'id',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: true,
        dict_write: true,
      },
    }],
    exceptions: ['value1', 'value2'],
    selectedProfileId: 'selectedProfileId'
  }

  beforeEach(() => {
    component = shallow(<ToolbarDropContainer {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})