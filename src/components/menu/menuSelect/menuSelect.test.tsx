import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { MenuSelect, mapStateToProps } from './menuSelect'
import { Map, fromJS } from 'immutable'
import { selectProfile, setActiveTab } from '../../../store/dispatcher'
import { act } from 'react-dom/test-utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faCaretDown, faPlus, faBan } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { waitFor } from '../../../utils/common'
library.add(faTimes, faCaretDown, faPlus, faBan, faSave)

jest.mock('../../../store/dispatcher')

describe('MenuSelect tests', () => {
  let component: ShallowWrapper
  let instance: MenuSelect
  const ownPropsMock = {
    items: [
      {
        id: 'id1',
        name: 'name1',
        is_enabled: true,
        permissions: {
          dl_read: true,
          dl_write: true,
          dict_read: true,
          dict_write: true,
        },
      },
      {
        id: 'id2',
        name: 'name2',
        is_enabled: false,
        permissions: {
          dl_read: true,
          dl_write: true,
          dict_read: true,
          dict_write: true,
        },
      },
    ],
  }
  const reduxPropsMock = {
    selectedProfile: {
      id: 'profileId',
      name: 'name',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: true,
        dict_write: true,
      },
    },
    openedTabs: Map(
      fromJS({
        profileId: {
          templateId: {
            id: 'templateId',
          },
        },
      })
    ),
    currentUser: Map(),
    selectedAccount: Map(),
  }
  const stateMock = {
    profiles: Map({
      selectedProfile: reduxPropsMock.selectedProfile,
      selectedAccount: reduxPropsMock.selectedAccount,
    }),
    editors: Map(
      fromJS({
        openedTabs: reduxPropsMock.openedTabs,
      })
    ),
    auth: Map(
      fromJS({
        user: reduxPropsMock.currentUser,
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<MenuSelect {...ownPropsMock} {...reduxPropsMock} />)
    instance = component.instance() as MenuSelect
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })

  it('updates the state on input change', () => {
    jest.spyOn(instance, 'onInputData')
    jest.spyOn(instance, 'setDropDown')
    instance.forceUpdate()
    const input = component.find('input')
    input.simulate('change', { currentTarget: { value: 'name2' } })
    expect(instance.state.filteredData).toEqual(ownPropsMock.items.filter((item) => item.name.includes('name2')))
    expect(instance.state.value).toEqual('name2')
    expect(instance.state.isDroppedDown).toEqual(true)
    expect(instance.onInputData).toHaveBeenCalledTimes(1)
    expect(instance.setDropDown).toHaveBeenCalledTimes(1)

    input.simulate('change', { currentTarget: { value: 'name999' } })
    expect(instance.state.filteredData).toEqual([])
    expect(instance.state.value).toEqual('name999')

    component.setProps({ data: [] })
    input.simulate('change', { currentTarget: { value: 'someValue' } })
    expect(instance.state.value).toEqual('someValue')
  })

  it('updates the state on input focus', () => {
    jest.spyOn(instance, 'onToggleButtonClick')
    instance.forceUpdate()
    const isDroppedDown = instance.state.isDroppedDown
    component.find('input').simulate('focus')
    expect(instance.onToggleButtonClick).toHaveBeenCalledTimes(1)
    expect(instance.state.filteredData).toEqual(ownPropsMock.items)
    expect(instance.state.isDroppedDown).toEqual(!isDroppedDown)
  })

  it('calls the right method on click', () => {
    jest.spyOn(instance, 'onToggleButtonClick')
    component.setState({ value: 'value' })
    component.find('.menu-select-toggle-dropdown').simulate('click')
    expect(instance.onToggleButtonClick).toHaveBeenCalledTimes(1)
  })

  it('calls the dispatcher method on selecting drop down item', () => {
    instance.onSelectDropDownItem({
      name: 'name',
      id: 'id',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: false,
        dict_write: false,
      },
    })
    expect(instance.state.value).toEqual('name')
    expect(selectProfile).toHaveBeenCalled()
    expect(setActiveTab).toHaveBeenCalledTimes(1)

    instance.onSelectDropDownItem({
      name: '',
      id: 'id',
      is_enabled: true,
      permissions: {
        dl_read: true,
        dl_write: true,
        dict_read: false,
        dict_write: false,
      },
    })
    expect(instance.state.value).toEqual('ПРОФИЛЬ (id)')
  })

  it('calls the right method on click', () => {
    const mounted = mount(<MenuSelect {...ownPropsMock} {...reduxPropsMock} />)
    const mountedInst = mounted.instance() as MenuSelect
    // @ts-ignore
    jest.spyOn(mountedInst.inputRef.current, 'focus')
    mounted.setState({ value: 'value' })
    mounted.find('button.menu-select-clear').simulate('click')
    // @ts-ignore
    expect(mountedInst.inputRef.current.focus).toHaveBeenCalledTimes(1)
  })

  /*it('updates the state on click', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <MenuSelect
          {...ownPropsMock}
          {...reduxPropsMock}
          currentUser={Map(fromJS({ role: { type: 'sys_admin' } }))}
        />
      )
      const mountedInst = mounted.instance() as MenuSelect
      jest.spyOn(mountedInst, 'setProfileName')
      const showNewProfileDialog = mountedInst.state.showNewProfileDialog
      mounted.find('.menu-select-add-profile').simulate('click')
      await waitFor(100)
      expect(mountedInst.state.showNewProfileDialog).toEqual(!showNewProfileDialog)
      mounted.update()

      mounted.find('input.menu-select-add-profile-input').simulate('change', { currentTarget: { value: 'profileName' } })
      expect(mountedInst.setProfileName).toHaveBeenCalledTimes(1)
    })
  })*/
})
