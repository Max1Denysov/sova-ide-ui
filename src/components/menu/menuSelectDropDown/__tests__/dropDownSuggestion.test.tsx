import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { DropDownSuggestion } from '../dropDownSuggestion'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
library.add(
  faCheckCircle,
)

describe('DropDownSuggestion tests', () => {
  let component: ShallowWrapper
  let instance: DropDownSuggestion
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
    setValueOnSelect: jest.fn(),
    value: 'value',
  }

  beforeEach(() => {
    component = shallow(<DropDownSuggestion {...propsMock} />)
    instance = component.instance() as DropDownSuggestion
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the right method on props change', () => {
    component.setProps({ activeItem: 0, value: 'newValue' })
    expect(propsMock.setActiveNode).toHaveBeenCalledTimes(1)
    expect(instance.state.value).toEqual('newValue')
  })

  it('calls the right methods on events', () => {
    const mounted = mount(
      <DropDownSuggestion {...propsMock} />
    )
    mounted.find('.dropdown-item').first().simulate('click')
    expect(propsMock.onSelectDropDownItem).toHaveBeenCalledTimes(1)

    mounted.find('.dropdown-item').first().simulate('mouseenter')
    expect(propsMock.handleMouseEnter).toHaveBeenCalledTimes(1)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const mounted = mount(
      <DropDownSuggestion
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

  it('calls the right methods on events', () => {
    const mounted = mount(
      <DropDownSuggestion
        {...propsMock}
        data={[]}
      />
    )
    const mountedInst = mounted.instance() as DropDownSuggestion
    jest.spyOn(mountedInst, 'handleSubmit')
    jest.spyOn(mountedInst, 'handleInputChange')
    jest.spyOn(mountedInst, 'mutate').mockImplementation(async () => ({ data: { dictionariesMutations: { response: { id: 'id' } } } }))
    mountedInst.forceUpdate()

    mounted.find('form').simulate('submit', { preventDefault: jest.fn(), stopPropagation: jest.fn() })
    expect(mountedInst.handleSubmit).toHaveBeenCalledTimes(1)
    expect(mountedInst.mutate).toHaveBeenCalledTimes(1)
    setTimeout(() => expect(propsMock.setValueOnSelect).toHaveBeenCalledTimes(1), 100)

    mounted.find('input').simulate('change', { target: { value: '[dict(' } })
    expect(mountedInst.handleInputChange).toHaveBeenCalledTimes(1)
    expect(mountedInst.state.value).toEqual('')
  })
})