import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import CompilationTasks from './compilationTasks'

describe('CompilationTasks tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    tasks: [
      {
        task_id: 'task_id_1',
        status: 'failed',
        success: null,
        created: 1111,
        updated: 2222,
      },
      {
        task_id: 'task_id_2',
        status: 'failed',
        success: null,
        created: 3333,
        updated: 4444,
      },
    ],
    refetchFunc: jest.fn(),
  }

  beforeEach(() => {
    component = shallow(<CompilationTasks {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      tasks: [
        {
          task_id: 'task_id_1',
          status: 'failed',
          success: null,
          created: 3333,
          updated: 4444,
        },
        {
          task_id: 'task_id_2',
          status: 'failed',
          success: null,
          created: 1111,
          updated: 2222,
        },
      ]
    })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      tasks: [
        {
          task_id: 'task_id_1',
          status: 'failed',
          success: null,
          created: 1111,
          updated: 2222,
        },
        {
          task_id: 'task_id_2',
          status: 'failed',
          success: null,
          created: 1111,
          updated: 4444,
        },
      ]
    })
    expect(component.exists()).toEqual(true)
  })
})