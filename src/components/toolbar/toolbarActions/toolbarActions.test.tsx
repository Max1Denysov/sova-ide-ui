import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { ToolbarActions, mapStateToProps } from './toolbarActions'
import { Map, List, fromJS } from 'immutable'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import apolloClient from '../../../graphql/apolloClient'

const randomNumber = () => {
  return Math.floor(Math.random() * 100) + 1
}

describe('ToolbarActions tests', () => {
  let component: ShallowWrapper
  const ownPropsMock = {
    client: apolloClient,
    config: [
      {
        title: 'title',
        name: 'name',
        icon: ['fas', 'times'] as [IconPrefix, IconName],
        iconProps: {
          size: 'lg',
        },
        color: 'green',
      },
    ],
    renderForm: true,
    alwaysShow: true,
  }
  const reduxPropsMock = {
    currentPath: '/path/',
    selectedProfileId: 'selectedProfileId',
    selectedSuites: Map(),
    templatesPinned: Map(),
    openedTabs: Map(),
    currentUser: Map(),
    selectedDictionaries: Map(),
  }
  const stateMock = {
    router: {
      location: {
        pathname: reduxPropsMock.currentPath,
      },
    },
    profiles: Map({
      selectedProfile: {
        id: reduxPropsMock.selectedProfileId,
      },
    }),
    editors: Map(
      fromJS({
        selectedSuites: reduxPropsMock.selectedSuites,
        openedTabs: reduxPropsMock.openedTabs,
        selectedDictionaries: reduxPropsMock.selectedDictionaries,
      })
    ),
    toolbar: Map(
      fromJS({
        templatesPinned: reduxPropsMock.templatesPinned,
      })
    ),
    auth: Map(
      fromJS({
        user: {},
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<ToolbarActions {...ownPropsMock} {...reduxPropsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
    expect(component.find('.toolbar-actions-form').exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxPropsMock)
  })

  it('returns a random number', () => {
    expect(typeof randomNumber()).toEqual('number')
  })
})
