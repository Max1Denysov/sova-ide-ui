import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { CompilationTask, mapStateToProps } from './compilationTask'
import { Map, fromJS } from 'immutable'
import { ApolloProvider } from 'react-apollo'
import apolloClient from '../../../graphql/apolloClient'
import { faExchangeAlt, faReply, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
library.add(faExchangeAlt, faReply, faTimes, faCheck)

describe('CompilationTask tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    task: {
      task_id: 'task_id',
      status: 'failed',
      success: null,
      created: 1,
      updated: 2,
    },
    refetchFunc: jest.fn(),
  }
  const reduxPropsMock = {
    animationEnabled: true,
    lastCompilationDate: Map(),
  }
  const stateMock = {
    settings: Map(
      fromJS({
        userSettings: {
          common: {
            visual: {
              clientSettings: {
                animationEnabled: {
                  value: reduxPropsMock.animationEnabled,
                },
              },
            },
          },
        },
      })
    ),
    editors: Map(
      fromJS({
        lastCompilationDate: reduxPropsMock.lastCompilationDate,
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<CompilationTask {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      currentUserRole: 'sys_admin',
    })
    expect(component.exists()).toEqual(true)
    expect(component.find('.compilation-tasks-item.failed').length).toBe(1)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const props = {
      task: {
        task_id: 'task_id',
        status: 'finished',
        success: null,
        created: 1,
        updated: 2,
      },
      refetchFunc: jest.fn(),
    }
    component = shallow(<CompilationTask {...props} {...reduxPropsMock} />)
    expect(component.find('.compilation-tasks-item.null').length).toBe(1)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const props = {
      task: {
        task_id: 'task_id',
        status: 'finished',
        success: true,
        created: 1,
        updated: 2,
      },
      refetchFunc: jest.fn(),
    }
    component = shallow(<CompilationTask {...props} {...reduxPropsMock} />)
    expect(component.find('.compilation-tasks-item.success').length).toBe(1)
  })

  it('doesnt call props functions by selecting a dropdown-item when if-statement is falsy', () => {
    const props = {
      currentUserRole: 'sys_admin',
      task: {
        task_id: 'task_id',
        status: 'failed',
        success: true,
        created: 1,
        updated: 2,
        extra: {
          complect_id: 'string',
          complect_revision_id: 'string'
        },
      },
    }
    const wrapper = mount(
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <CompilationTask {...ownPropsMock} {...reduxPropsMock} {...props} />
        </Provider>
      </ApolloProvider>
    )
    wrapper.find('.compilation-tasks-toggle').simulate('click')
    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.find('button').length).toBe(1)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})
