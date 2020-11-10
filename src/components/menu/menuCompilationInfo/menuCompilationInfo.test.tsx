import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { MenuCompilationInfo, mapStateToProps } from './menuCompilationInfo'
import { Map, fromJS } from 'immutable'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { store, history } from '../../../store/store'
import { COMPILATION_DEPLOY_LIST_QUERY } from '../../../graphql/queries/compilationQueries'
import { waitFor } from '../../../utils/common'
import { faWarehouse, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ConnectedRouter } from 'connected-react-router'
library.add(faWarehouse, faRedoAlt)

describe('MenuCompilationInfo tests ', () => {
  let component: ShallowWrapper
  const propsMock = {
    rehydrated: true,
    lastCompilationDate: Map({
      date: 'date',
      uuid: 'id',
    }),
    selectedAccountComplect: Map({
      id: 'id',
    }),
  }
  const stateMock = {
    _persist: {
      rehydrated: propsMock.rehydrated,
    },
    editors: Map(fromJS(propsMock)),
    profiles: Map(
      fromJS({
        selectedAccountComplect: propsMock.selectedAccountComplect,
      })
    ),
  }

  const apolloMocks = {
    request: {
      query: COMPILATION_DEPLOY_LIST_QUERY,
      variables: {
        limit: 250,
        order: {
          field: 'created',
          order: -1,
        },
        extra: {
          complect_id: 25,
        },
      },
      pollInterval: 30000,
    },
    result: {
      data: {
        compilationDeployListQuery: {
          status: true,
          response: {
            items: [
              {
                task_id: '',
                status: true,
                success: 'success',
                created: 'created',
                updated: 0,
                extra: {
                  complect_id: 'x',
                  complect_revision_id: 'y',
                },
              },
            ],
          },
          variables: { extra: { complect_id: 'id' }, limit: 250, order: { field: 'created', order: -1 }, silent: true },
        },
      },
    },
  }

  beforeEach(() => {
    component = shallow(<MenuCompilationInfo {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  /* it('*UNIT* renders final state', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <Provider store={store}>
          <MockedProvider mocks={[apolloMocks]} addTypename={false}>
            <ConnectedRouter history={history}>
              <MenuCompilationInfo {...propsMock} />
            </ConnectedRouter>
          </MockedProvider>
        </Provider>
      )
      await waitFor(100)
      mounted.update()
      expect(mounted.find('.help').exists()).toEqual(false)
    })
  }) */

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
