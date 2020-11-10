import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { DictItemWithQuery, DictionariesItem } from './dictionariesItem'
import { MockedProvider } from '@apollo/react-testing'
import { act } from 'react-dom/test-utils'
import { DICTIONARY_FETCH_QUERY } from '../../../graphql/queries/dictionariesQueries'
import { Map } from 'immutable'
import apolloClient from '../../../graphql/apolloClient'
import { ApolloProvider } from 'react-apollo'
/*import { waitFor } from '../../../utils/common'*/
import 'intersection-observer'
import {
  faCheck,
  faTimes,
  faThumbtack,
  faPencilAlt,
  faCaretDown,
  faAlignLeft,
  faExpandAlt,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCheck, faTimes, faThumbtack, faPencilAlt, faCaretDown, faAlignLeft, faExpandAlt)

describe('DictionariesItem tests', () => {
  let component: ShallowWrapper
  let instance: DictionariesItem
  let componentDictionariesItem: ShallowWrapper
  /*let rendered: ReactWrapper*/
  const propsMock = {
    client: apolloClient,
    rehydrated: true,
    dictId: 'dictId',
    scrollTo: 'idToScroll',
    isEditorsPage: true,
    style: {
      color: '#fff',
    },
    currentUser: Map(),
    selectedProfileId: 'selectedProfileId',
    openedTabs: Map(),
    selectedAccount: Map(),
    showLinesCount: true,
    fontSize: '12',
    showDescription: false,
    isExpanded: false,
    params: {
      isEditorsPage: true,
      dictId: 'string',
      templateId: 'string',
      style: {},
      dictAnimationFinish: true,
      currentUser: Map(),
      selectedProfileId: 'string',
    },
    data: {
      dictionariesQueries: {
        item: {
          id: 'string',
          hidden: true,
          is_enabled: true,
          common: true,
          content: 'string',
          code: 'string',
          description: 'string',
          updated: 0,
          profile_ids: [''],
          meta: {
            last_user: {
              uuid: 'string',
              name: 'string',
              username: 'string',
              user_role: 'string',
            },
          },
        },
      },
    },
  }
  const apolloMocks = {
    request: {
      query: DICTIONARY_FETCH_QUERY,
      variables: {
        id: 'id',
      },
    },
    result: {
      data: {
        dictionariesQueries: {
          item: {
            id: 'id',
            code: 'code',
            description: 'description',
            content: 'content',
            is_enabled: true,
            common: 'common',
            profile_ids: [],
            updated: 'updated',
            meta: {},
            stats: {
              last_used: 'last_used',
              used_7d: false,
              used_30d: true,
            },
          },
        },
      },
    },
  }

  beforeEach(() => {
    component = shallow(<DictItemWithQuery {...propsMock} />)
    componentDictionariesItem = shallow(<DictionariesItem {...propsMock} />)
    instance = componentDictionariesItem.instance() as DictionariesItem
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    expect(componentDictionariesItem.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const wrapperTest = mount(
      <ApolloProvider client={apolloClient}>
        <DictionariesItem {...propsMock} />
      </ApolloProvider>
    )
    expect(wrapperTest.find('.dict-item.dict-item_editors.enabled').length).toBe(1)
  })

  it('test props', () => {
    const props = {
      params: {
        isEditorsPage: false,
        dictId: 'string',
        templateId: 'string',
        style: {},
        dictAnimationFinish: true,
        currentUser: Map(),
        selectedProfileId: 'string',
      },
      data: {
        dictionariesQueries: {
          item: {
            id: 'string',
            hidden: true,
            is_enabled: false,
            common: true,
            content: 'string',
            code: 'string',
            description: 'string',
            updated: 0,
            profile_ids: [''],
            meta: {
              last_user: {
                uuid: 'string',
                name: 'string',
                username: 'string',
                user_role: 'string',
              },
            },
          },
        },
      },
    }

    const wrapperTest = mount(
      <ApolloProvider client={apolloClient}>
        <DictionariesItem {...propsMock} {...props} />
      </ApolloProvider>
    )
    expect(wrapperTest.find('.dict-item.disabled').length).toBe(1)
  })

  it('test props', () => {
    const props = {
      params: {
        isEditorsPage: false,
        dictId: 'string',
        templateId: 'string',
        style: {},
        dictAnimationFinish: true,
        currentUser: Map(),
        selectedProfileId: 'string',
      },
      data: {
        dictionariesQueries: {
          item: {
            id: 'string',
            hidden: true,
            is_enabled: false,
            common: true,
            content: 'string',
            code: 'string',
            description: 'string',
            updated: 0,
            profile_ids: [''],
            meta: {
              last_user: {
                uuid: 'string',
                name: 'string',
                username: 'string',
                user_role: 'string',
              },
            },
          },
        },
      },
    }

    const wrapperTest = mount(
      <ApolloProvider client={apolloClient}>
        <DictionariesItem {...propsMock} {...props} />
      </ApolloProvider>
    )
    expect(wrapperTest.find('.dict-header-btn').length).toBe(3)
  })

  /*it('*UNIT* renders loading text on loading state', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <MockedProvider mocks={[]}>
          <DictItemWithQuery {...propsMock} />
        </MockedProvider>
      )

      expect(mounted.find('.dot-loader').exists()).toEqual(true)
    })
  })*/

  /*it('*UNIT*', async () => {
    // @ts-ignore
    await act(async () => {
      const mounted = mount(
        <MockedProvider mocks={[apolloMocks]} addTypename={false}>
          <DictItemWithQuery {...propsMock} />
        </MockedProvider>
      )
      await waitFor(100)
      mounted.update()
      expect(mounted.find(DictionariesItem)).toHaveLength(1)
    })
  })*/

  it('updates the state correctly and calls the callback', () => {
    const initState = instance.state.isExpanded
    instance.toggleExpand()
    expect(instance.state.isExpanded).toEqual(!initState)

    const initState1 = instance.state.showDescription
    instance.toggleDescription()
    expect(instance.state.showDescription).toEqual(!initState1)
  })
})
