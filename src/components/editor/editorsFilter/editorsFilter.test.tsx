import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { EditorsFilter, mapStateToProps } from './editorsFilter'
import { Map, fromJS } from 'immutable'
import { setEditorsFilter } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('EditorsFilter tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    editorsFilter: Map({
      showOk: false,
      showAttention: true,
      showWarning: true,
    }),
  }
  const stateMock = {
    editors: Map(
      fromJS({
        editorsFilter: propsMock.editorsFilter,
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<EditorsFilter {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      editorsFilter: Map({
        showOk: true,
        showAttention: true,
        showWarning: true,
      }),
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the method with id from config', () => {
    component.find('.editorsFilter-item').first().simulate('click')
    expect(setEditorsFilter).toHaveBeenCalledTimes(1)
  })

  it('calls the method with id from config', () => {
    component.find('.editorsFilter-title > span').simulate('click')
    expect(setEditorsFilter).toHaveBeenCalledTimes(1)
  })

  it('changes the state properly', () => {
    component.find('.editors-toggle-btn').simulate('click')
    component.update()
    expect(component.exists()).toEqual(true)
  })
})
