import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { EditorsSorting, mapStateToProps } from './editorsSorting'
import { Map, fromJS } from 'immutable'
import { setEditorsSorting } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('EditorsSorting tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    editorsSorting: Map({
      type: 'created',
      isAsc: true,
    }),
  }
  const stateMock = {
    editors: Map(fromJS({
      editorsSorting: propsMock.editorsSorting,
    })),
  }

  beforeEach(() => {
    component = shallow(<EditorsSorting {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      editorsSorting: Map({
        type: 'created',
        isAsc: false,
      }),
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the right method on click', () => {
    component.find('.editorsSorting-item').first().simulate('click')
    expect(setEditorsSorting).toHaveBeenCalledTimes(1)
  })
})