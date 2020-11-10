import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import EditorsTitle from './editorsTitle'
import { store } from '../../../store/store'
import { Map, fromJS } from 'immutable'
/*import { setPinnedTemplates } from '../../../store/dispatcher'*/
import { Provider } from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretRight, faPen, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
library.add(
  faCaretRight,
  faPen,
  faTimes,
  faCheck,
)

jest.mock('../../../store/dispatcher')

describe('EditorsTitle tests', () => {
  let component: ShallowWrapper
  let instance: EditorsTitle
  const propsMock = {
    selectedProfileId: 'selectedProfileId',
    suiteId: 'suiteId',
    template: {
      id: 'templateId',
      position: 1,
      content: 'content',
      created: 1,
      updated: 2,
      is_enabled: true,
      meta: {
        title: 'title',
        description: 'description',
        last_user: null
      },
      stats: {
        last_used: 'last_used',
        used_7d: 0,
        used_30d: 1,
      }
    },
    showFullscreen: false,
    handleOpen: jest.fn(),
    saved: true,
    isPinned: false,
    currentUser: Map(fromJS({
      id: 'id',
      name: 'name',
      username: 'username',
      role: {
        id: 2,
        name: 'User',
      }
    })),
    dlReadOnly: false,
  }

  beforeEach(() => {
    component = shallow(<EditorsTitle {...propsMock} />)
    instance = component.instance() as EditorsTitle
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the right method on btn click', () => {
    jest.spyOn(instance, 'handleTitleEdit').mockImplementation(jest.fn())
    component.find('.editorHeader-edit').simulate('click')
    expect(instance.handleTitleEdit).toHaveBeenCalledTimes(1)

    component.setState({ allowEditTitle: true })
    component.find('.editorHeader-action').first().simulate('click')
    expect(instance.handleTitleEdit).toHaveBeenCalledTimes(2)
  })

  it('updates the state on input change', () => {
    component.setState({ allowEditTitle: true })
    jest.spyOn(instance, 'handleTitleChange')
    const newValue = 'newValue'
    component.find('input').simulate('change', { currentTarget: { value: newValue } })
    expect(instance.handleTitleChange).toHaveBeenCalledTimes(1)
    expect(instance.state.newTitle).toEqual(newValue)
  })

  it('calls the right method on input keypress event', () => {
    component.setState({ allowEditTitle: true })
    jest.spyOn(instance, 'handleKeyDown')
    jest.spyOn(instance, 'handleConfirm')
    component.find('input').simulate('keydown', { key: 'Enter' })
    expect(instance.handleKeyDown).toHaveBeenCalledTimes(1)
    expect(instance.handleConfirm).toHaveBeenCalledTimes(1)

    component.setState({ allowEditTitle: true })
    jest.spyOn(instance, 'handleTitleEdit')
    component.find('input').simulate('keydown', { key: 'Escape' })
    expect(instance.handleKeyDown).toHaveBeenCalledTimes(2)
    expect(instance.handleTitleEdit).toHaveBeenCalledTimes(1)
  })

  it('calls the method from props on btn click', () => {
    component.find('.editorHeader-toggle').simulate('click')
    expect(propsMock.handleOpen).toHaveBeenCalledTimes(1)
  })

  /*it('calls the right method on btn click', () => {
    const mounted = mount(
      <Provider store={store}>
        <EditorsTitle {...propsMock} />
      </Provider>
    )
    const mountedInst = mounted.children().instance() as EditorsTitle
    jest.spyOn(mountedInst, 'handleTitleEdit').mockImplementation(jest.fn())
    mounted.children().setState({ allowEditTitle: true })
    mounted.children().find('.editorHeader-action').last().simulate('click')
    expect(mountedInst.handleTitleEdit).toHaveBeenCalledTimes(1)

    mounted.setProps({ isPinned: true })
    mounted.children().setState({ newTitle: 'newTemplateTitle' })
    mounted.update()
    mounted.children().find('.editorHeader-action').last().simulate('click')
    expect(setPinnedTemplates).toHaveBeenCalledTimes(1)
  })*/
})