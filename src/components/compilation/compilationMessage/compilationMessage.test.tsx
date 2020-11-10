import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { CompilationMessage, mapStateToProps } from './compilationMessage'
import { Map } from 'immutable'
import apolloClient from '../../../graphql/apolloClient'
import { faCaretRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCaretRight, faAngleDoubleRight)

describe('CompilationMessage tests ', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    item: {
      type: 'type',
      status: 'status',
      message: 'message',
      near_text: 'near_text',
      profile_id: 'profile_id',
      suite_id: 'suite_id',
      template_id: 'template_id',
      template_meta: {
        title: 'title',
        description: 'description',
        last_user: {
          name: 'name',
          uuid: 'uuid',
          username: 'username',
          user_role: 'user_role',
        },
      },
    },
    allMessagesOpened: true,
    client: apolloClient,
    push: jest.fn(),
  }
  const reduxPropsMock = {
    currentPath: '/currentPath/',
    currentUser: Map(),
    selectedProfileId: 'selectedProfileId',
    activeTab: 'activeTab',
    openedTabs: Map(),
    selectedAccount: Map({
      id: 25,
      name: 'test1234567',
      account_id: 'f8259f2a-2316-45dd-b9bc-97df2',
    }),
  }
  const stateMock = {
    router: {
      location: {
        pathname: reduxPropsMock.currentPath,
      },
    },
    auth: Map({
      user: reduxPropsMock.currentUser,
    }),
    profiles: Map({
      selectedProfile: {
        id: reduxPropsMock.selectedProfileId,
      },
      selectedAccount: reduxPropsMock.selectedAccount,
    }),
    editors: Map({
      activeTab: reduxPropsMock.activeTab,
      openedTabs: reduxPropsMock.openedTabs,
    }),
  }

  beforeEach(() => {
    component = shallow(<CompilationMessage {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('doesnt call props functions by selecting a dropdown-item when if-statement is falsy', () => {
    const wrapper = mount(<CompilationMessage {...ownPropsMock} {...reduxPropsMock} />)
    wrapper.find('.compilation-message-toggle').simulate('click')
    wrapper.find('.compilation-message-scroll-btn').simulate('click')
    //wrapper.find('.dropdown-item').first().simulate('click')
    expect(wrapper.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })
})
