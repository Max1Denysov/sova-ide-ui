import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { CustomRoute, mapStateToProps } from '../customRoute'
import { Map, List, fromJS } from 'immutable'
import EmptyComponent from '../emptyComponent'

describe('CustomRoute tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    currentUserRole: 'role_admin',
    currentUserGroups: List([
      Map({
        id: 1,
        group_name: 'Лингвисты',
        group_id: 'cc08dfc7-20ad-4233-9f28-38baa34122ab',
        group_type: 'linguists',
      }),
      Map({
        id: 4,
        group_name: 'Группа поддержки ARM',
        group_id: '2f888126-b943-4eed-b085-b43ea0ea5096',
        group_type: 'support',
      }),
    ]),
  }
  const stateMock = {
    auth: Map(
      fromJS({
        user: {
          role: {
            type: propsMock.currentUserRole,
          },
          groups: propsMock.currentUserGroups,
        },
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<CustomRoute {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component = shallow(<CustomRoute {...propsMock} path={['/']} exact component={EmptyComponent} />)
    expect(component.exists()).toEqual(true)

    component.setProps({ path: ['/users/'] })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })
})
