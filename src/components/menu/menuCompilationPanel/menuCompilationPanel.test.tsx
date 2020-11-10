import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { MenuCompilationPanel, mapStateToProps } from './menuCompilationPanel'
import { Map } from 'immutable'
import { ApolloProvider } from 'react-apollo'
import apolloClient from '../../../graphql/apolloClient'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
import { faComments, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { COMPILATION_CREATE_MUTATION } from '../../../graphql/queries/compilationQueries'
library.add(faComments, faCheck, faTimes)

describe('MenuCompilationPanel tests ', () => {
  let component: ShallowWrapper
  const reduxPropsMock = {
    selectedAccountComplect: Map({
      id: 'da40ed72-fe1b-4f61-a956-bac254effdd0',
    }),
  }
  const stateMock = {
    profiles: Map({
      selectedAccountComplect: reduxPropsMock.selectedAccountComplect,
    }),
  }

  const apolloMocks = {
    request: {
      mutation: COMPILATION_CREATE_MUTATION,
      variables: {
        params: {
          complect_id: 25,
          try_create_revision: true,
        },
      },
    },
    result: {
      data: {
        compilationCreateMutation: {
          status: true,
        },
      },
    },
  }

  beforeEach(() => {
    component = shallow(<MenuCompilationPanel {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
  it('*UNIT* renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <MenuCompilationPanel {...reduxPropsMock} />
        </ApolloProvider>
      </Provider>
    )

    wrapper.find('.menu-compilation-btn').at(0).simulate('click')
    expect(wrapper.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})
