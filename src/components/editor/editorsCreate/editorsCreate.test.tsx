import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { EditorsCreate, mapStateToProps } from './editorsCreate'
import { Map, fromJS } from 'immutable'
import { Mutation } from 'react-apollo'
import { setStatusBarNotification } from '../../../store/dispatcher'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faBan } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { MockedProvider } from '@apollo/react-testing'
library.add(faPlus, faBan, faSave)

jest.mock('../../../store/dispatcher')

describe('EditorsCreate tests', () => {
  let component: ShallowWrapper
  let instance: EditorsCreate
  const propsMock = {
    activeTab: 'activeTab',
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
    currentUser: Map(
      fromJS({
        id: 'id',
        name: 'name',
        username: 'username',
        role: {
          id: 2,
          name: 'User',
        },
      })
    ),
    editorsSorting: Map(),
  }
  const stateMock = {
    profiles: Map({
      selectedProfile: propsMock.selectedProfile,
    }),
    editors: Map(
      fromJS({
        activeTab: propsMock.activeTab,
        editorsSorting: propsMock.editorsSorting,
      })
    ),
    auth: Map(
      fromJS({
        user: propsMock.currentUser,
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<EditorsCreate {...propsMock} />)
    instance = component.instance() as EditorsCreate
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders the component correctly', () => {
    const mounted = mount(
      <MockedProvider mocks={[]}>
        <EditorsCreate {...propsMock} />
      </MockedProvider>
    )
    mounted.find('.editors-add-new.add-toggle').simulate('click')
    expect(mounted.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('toggles the state properly', () => {
    const prevState = instance.state.isActive
    component.find('.editors-add-new.add-toggle').simulate('click')
    expect(instance.state.isActive).toEqual(!prevState)
  })

  it('clears the input by clear btn click', () => {
    component.setState({ isActive: true, title: 'title' })
    component.find('.editors-add-input button').simulate('click')
    expect(instance.state.title).toEqual('')
  })

  it('calls the right method and updates input value', () => {
    const inputMock = 'TEST INPUT'
    component.setState({ isActive: true })
    component.find('input').simulate('change', { currentTarget: { value: inputMock } })
    expect(instance.state.title).toEqual(inputMock)
  })

  it('calls the right method and updates the state', () => {
    const activeMock = true
    component.setState({ isActive: activeMock })
    // @ts-ignore
    component.find(Mutation).props().onCompleted('')
    expect(instance.state.isActive).toEqual(!activeMock)
    setTimeout(() => expect(setStatusBarNotification).toHaveBeenCalledTimes(1), 500)
  })

  it('calls the right method on pressing Enter key', () => {
    component.setState({ isActive: true, title: 'newTitle' })
    jest.spyOn(instance, 'mutateFunc')
    instance.forceUpdate()
    component.find('.editors-add-input input').simulate('keypress', { key: 'Enter' })
    expect(instance.mutateFunc).toHaveBeenCalledTimes(1)
  })
})
