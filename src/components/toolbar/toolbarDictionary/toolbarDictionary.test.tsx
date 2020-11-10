import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarDictionary, mapStateToProps } from './toolbarDictionary'
import { Map, fromJS } from 'immutable'
import { selectUnselectDictionaries } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('ToolbarDictionary tests', () => {
  let component: ShallowWrapper
  let instance: ToolbarDictionary
  const ownPropsMock = {
    dict: {
      id: 'string',
      hidden: true,
      is_enabled: true,
      common: true,
      content: 'string',
      code: 'string',
      description: 'string',
      updated: 0,
      profile_ids: ['string'],
      meta: {
        last_user: {
          uuid: 'string',
          name: 'string',
          username: 'string',
          user_role: 'string',
        },
      },
    },
    isTemplatesPage: false,
    category: 'category',
    style: {},
  }
  const reduxPropsMock = {
    selectedProfileId: 'profileId',
    isOpened: false,
    isOpenedInEditors: false,
    isSelected: true,
    isEnabled: false,
    currentUser: Map(),
  }
  const stateMock = {
    profiles: Map({
      selectedProfile: {
        id: reduxPropsMock.selectedProfileId,
      },
    }),
    editors: Map(
      fromJS({
        openedDictionaries: {
          suiteId: {},
        },
        selectedDictionaries: {
          [ownPropsMock.dict.id]: {
            is_enabled: reduxPropsMock.isEnabled,
          },
        },
        displayDictionaryEditor: {
          id: 'dictId',
          status: 'active',
        },
      })
    ),
    auth: Map({
      user: reduxPropsMock.currentUser,
    }),
  }

  beforeEach(() => {
    component = shallow(<ToolbarDictionary {...ownPropsMock} {...reduxPropsMock} />)
    instance = component.instance() as ToolbarDictionary
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      suite: {
        id: 'suiteId',
        name: 'name',
        title: 'title',
        code: 'code',
        updated: '',
        stat: {
          items: 0,
        },
      },
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any, ownPropsMock)).toEqual(reduxPropsMock)
  })

  it('calls the right methods on click', () => {
    jest.spyOn(instance, 'selectDict')
    instance.forceUpdate()
    component.find('.toolbar-file-select').first().simulate('click')
    expect(instance.selectDict).toHaveBeenCalledTimes(1)
    expect(selectUnselectDictionaries).toHaveBeenCalledTimes(4)
  })

  it('calls the right methods on click', () => {
    jest.spyOn(instance, 'toggleDict')
    instance.forceUpdate()
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })
    expect(instance.toggleDict).toHaveBeenCalledTimes(1)
    /*expect(setOpenedDictionaries).toHaveBeenCalledTimes(1)
    expect(scrollToDictionary).toHaveBeenCalledTimes(1)*/

    /*component.setProps({ isTemplatesPage: true })
    component.find('.toolbar-file-toggle').simulate('click', { detail: 1 })
    expect(instance.toggleFile).toHaveBeenCalledTimes(2)
    expect(displayDictionaryEditor).toHaveBeenCalledTimes(1)*/

    /*component.find('.toolbar-file-toggle').simulate('click', { detail: 2 })
    expect(instance.state.nameIsChanging).toEqual(true)*/
  })

  /*it('calls the right method on props change', () => {
    jest.spyOn(instance, 'selectSuite')
    component.setProps({
      checkAll: true,
      isChecked: true,
    })
    expect(instance.selectSuite).toHaveBeenCalledTimes(1)

    component.setProps({ checkAll: false })
    expect(instance.selectSuite).toHaveBeenCalledTimes(2)

    component.setProps({ checkAll: true })
  })*/
})
