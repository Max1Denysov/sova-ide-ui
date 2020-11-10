import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { MenuPanel, mapStateToProps } from './menuPanel'
import { Map, fromJS } from 'immutable'
import { PROFILE_QUERIES_GQL_SYS_ADMIN } from '../../../graphql/queries/profilesQueries'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { history, store } from '../../../store/store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { ConnectedRouter } from 'connected-react-router'
import apolloClient from '../../../graphql/apolloClient'
library.add(faSearch, faCaretDown)

describe('MenuPanel tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    client: apolloClient,
    renderAccountsList: false,
  }
  const reduxPropsMock = {
    rehydrated: true,
    selectedAccount: Map({
      id: 25,
      name: 'test1234567',
      account_id: 'f8259f2a-2316-45dd-b9bc-97df2',
    }),
    currentUser: Map(
      fromJS({
        role: {
          type: 'sys_admin',
        },
      })
    ),
  }
  const stateMock = {
    _persist: {
      rehydrated: reduxPropsMock.rehydrated,
    },
    auth: Map(
      fromJS({
        user: reduxPropsMock.currentUser,
      })
    ),
    profiles: Map(
      fromJS({
        selectedAccount: reduxPropsMock.selectedAccount,
      })
    ),
    users: Map({
      currentUser: reduxPropsMock.currentUser,
    }),
  }
  const apolloMocks = {
    request: {
      query: PROFILE_QUERIES_GQL_SYS_ADMIN,
      variables: { user: { user_id: '' }, account_id: '', full_list: true },
    },
    result: {
      data: {
        profilesQueries: {
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
        },
      },
      networkStatus: 4,
    },
  }

  const apolloMocksACCAdmin = {
    request: {
      query: PROFILE_QUERIES_GQL_SYS_ADMIN,
      variables: {
        user: { user_id: 'f8259f2a-2316-45dd-b9bc-97df27b8a5cc' },
        account_id: 'f8259f2a-2316-45dd-b9bc-97df27b8a5cc',
        full_list: true,
      },
    },
    result: {
      data: {
        profilesQueries: {
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
        },
      },
      networkStatus: 4,
    },
  }

  beforeEach(() => {
    component = shallow(<MenuPanel {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders loading text on loading state', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <Provider store={store}>
          <MockedProvider mocks={[apolloMocks]} addTypename={false}>
            <ConnectedRouter history={history}>
              <MenuPanel {...ownPropsMock} {...reduxPropsMock} />
            </ConnectedRouter>
          </MockedProvider>
        </Provider>
      )
      expect(mounted.find('.menu-panel').exists()).toEqual(true)
    })
  })

  /* it('*UNIT* renders loading text on loading state', async () => {
    const testProps = {
      currentUser: Map(
        fromJS({
          role: {
            type: 'acc_admin',
          },
        })
      ),
    }
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <Provider store={store}>
          <MockedProvider mocks={[apolloMocksACCAdmin]} addTypename={false}>
            <ConnectedRouter history={history}>
              <MenuPanel {...ownPropsMock} {...reduxPropsMock} {...testProps} />
            </ConnectedRouter>
          </MockedProvider>
        </Provider>
      )
      expect(mounted.find('.menu-panel').exists()).toEqual(true)
    })
  }) */

  it('*UNIT* renders without crashing', () => {
    component.setProps({ renderAccountsList: true })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})
