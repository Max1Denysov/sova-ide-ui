import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import MenuSelectDropDown from '../menuSelectDropDown'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
library.add(
  faCheckCircle,
)

describe('MenuSelectDropDown tests', () => {
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
    exceptions: ['exception1', 'exception2'],
    selectedProfileId: 'selectedProfileId',
    activeItem: 1,
    setActiveNode: jest.fn(),
    handleMouseEnter: jest.fn(),
  }

  beforeEach(() => {
    component = shallow(<MenuSelectDropDown {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the right methods on events', () => {
    const mounted = mount(
      <MenuSelectDropDown {...propsMock} />
    )
    mounted.find('.dropdown-item').first().simulate('click')
    expect(propsMock.onSelectDropDownItem).toHaveBeenCalledTimes(1)
    expect(propsMock.setDropDown).toHaveBeenCalledTimes(1)

    mounted.find('.dropdown-item').first().simulate('mouseenter')
    expect(propsMock.handleMouseEnter).toHaveBeenCalledTimes(1)

    // @ts-ignore
    mounted.find('.dropdown').first().props().onClick()
    expect(propsMock.setDropDown).toHaveBeenCalledTimes(2)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const mounted = mount(
      <MenuSelectDropDown
        {...propsMock}
        activeItem={0}
        selectedProfileId="selectedProfileId"
        data={[
          {
            name: '',
            id: 'id',
            is_enabled: true,
            permissions: {
              dl_read: true,
              dl_write: true,
              dict_read: true,
              dict_write: true,
            },
          }
        ]}
      />
    )
    expect(mounted.exists()).toEqual(true)
    mounted.setProps({ data: [] })
    expect(mounted.exists()).toEqual(true)
  })
})
