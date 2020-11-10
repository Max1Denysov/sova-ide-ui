import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { Compilation, mapStateToProps } from './compilation'
import { Map } from 'immutable'
import { fromJS } from 'immutable'
import { ApolloProvider } from 'react-apollo'
import apolloClient from '../../graphql/apolloClient'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { COMPILATION_LIST_QUERY } from '../../graphql/queries/compilationQueries'

describe('Compilation tests ', () => {
  let component: ShallowWrapper
  const propsMock = {
    rehydrated: true,
    lastCompilationDate: Map(),
    selectedAccount: Map(),
    selectedAccountComplect: Map(),
  }
  const stateMock = {
    _persist: {
      rehydrated: propsMock.rehydrated,
    },
    editors: Map({
      lastCompilationDate: propsMock.lastCompilationDate,
    }),
    profiles: Map(
      fromJS({
        selectedAccount: propsMock.selectedAccount,
        selectedAccountComplect: propsMock.selectedAccountComplect,
      })
    ),
  }

  const apolloMocks = {
    request: {
      query: COMPILATION_LIST_QUERY,
      context: {
        version: 1,
      },
      variables: {
        extra: {
          complect_id: 'id',
        },
        limit: 250,
        order: {
          field: 'created',
          order: -1,
        },
        silent: true,
      },
      pollInterval: 30000,
    },
    result: {
      data: {
        compilationListQuery: {
          response: {
            items: [
              {
                task_id: 'string',
                status: 'string',
                success: true,
                created: 0,
                updated: 0,
                errortext: 'string',
                result: {
                  output: 'string',
                  messages: [],
                  complect_revision_id: 'string',
                  complect_revision_code: 'string',
                },
                extra: {
                  complect_id: 'string',
                  complect_revision_id: 'string',
                },
              },
            ],
          },
        },
      },
      networkStatus: 4,
    },
  }

  beforeEach(() => {
    component = shallow(<Compilation {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const wrapper = mount(<Compilation {...propsMock} />)
    expect(wrapper.find('.workarea-empty-bg').length).toBe(1)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const testProps = {
      selectedAccount: Map({
        id: 'id',
      }),
    }
    const wrapper1 = mount(
      <ApolloProvider client={apolloClient}>
        <Compilation {...propsMock} {...testProps} />
      </ApolloProvider>
    )
    expect(wrapper1.find('.workarea-empty-bg').length).toBe(1)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const testProps = {
      selectedAccount: Map({
        id: 'id',
      }),
      selectedAccountComplect: Map({
        id: 'id',
      }),
    }
    const wrapper1 = mount(
      <ApolloProvider client={apolloClient}>
        <Compilation {...propsMock} {...testProps} />
      </ApolloProvider>
    )
    expect(wrapper1.find('.compilation').length).toBe(1)
  })

  it('*UNIT* renders loading text on loading state', async () => {
    const testProps = {
      selectedAccount: Map({
        id: 'id',
      }),
      selectedAccountComplect: Map({
        id: 'id',
      }),
    }
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <MockedProvider mocks={[]}>
          <ApolloProvider client={apolloClient}>
            <Compilation {...propsMock} {...testProps} />
          </ApolloProvider>
        </MockedProvider>
      )

      expect(mounted.find('.dot-loader').exists()).toEqual(true)
    })
  })

  /* it('*UNIT* renders final state', async () => {
    const testProps = {
      selectedAccount: Map({
        id: 'id',
      }),
      selectedAccountComplect: Map({
        id: 'id',
      }),
    }
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <Provider store={store}>
          <MockedProvider mocks={[apolloMocks]} addTypename={false}>
            <ConnectedRouter history={history}>
              <Compilation {...propsMock} {...testProps} />
            </ConnectedRouter>
          </MockedProvider>
        </Provider>
      )
      await waitFor(100)
      mounted.update()
      expect(mounted.find('.help-toolbar-pinned').exists()).toEqual(true)
    })
  }) */

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
