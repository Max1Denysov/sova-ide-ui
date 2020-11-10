import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Settings, mapStateToProps } from './settings'
import { Map, fromJS } from 'immutable'
import { updateUserSettings } from '../../store/dispatcher'
import Toggle from '../common/toggle'
import apolloClient from '../../graphql/apolloClient'

jest.mock('../../store/dispatcher')

describe('SettingsList tests ', () => {
  let component: ShallowWrapper
  let instance: Settings
  const propsMock = {
    currentPath: '/settings/common/',
    userSettings: Map(
      fromJS({
        common: {
          visual: {
            title: 'Визуальное оформление',
            subtitle: 'Настройки влияющие на внешний вид АРМ и его элементов',
            params: {
              selectParam: {
                type: 'select',
                id: 'selectParam',
                name: 'Параметр с селектом',
                value: {
                  name: 'Вариант 1',
                  value: 'var1',
                },
                options: [
                  {
                    name: 'Вариант 1',
                    value: 'var1',
                  },
                  {
                    name: 'Вариант 2',
                    value: 'var2',
                  },
                ],
              },
              toggleParam: {
                type: 'toggle',
                id: 'toggleParam',
                name: 'Параметр с тогглом',
                value: true,
              },
              inputParam: {
                type: 'input',
                id: 'inputParam',
                name: 'Параметр с инпутом',
                value: 'Значение параметра',
              },
              fileParam: {
                type: 'file',
                id: 'fileParam',
                name: 'Аватар',
                value: '../../../assets/images/avatar.jpeg',
              },
            },
          },
          other1: {
            title: 'title',
            params: {},
          },
          other2: {
            subtitle: 'title',
            params: {},
          },
          other3: {
            params: {},
          },
          other4: {},
        },
      })
    ),
    currentUser: Map(),
  }
  const stateMock = {
    settings: Map({
      userSettings: propsMock.userSettings,
    }),
    router: {
      location: {
        pathname: propsMock.currentPath,
      },
    },
    auth: Map({
      user: propsMock.currentUser,
    }),
  }

  beforeEach(() => {
    component = shallow(<Settings client={apolloClient} {...propsMock} />)
    instance = component.instance() as Settings
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({
      currentPath: '/path/',
      quickSettings: {
        route: 'common',
        group: 'visual',
      },
    })
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('calls the right methods on triggering handler', () => {
    jest.spyOn(instance, 'getCurrentRoute')
    component.find(Toggle).props().handler()
    expect(instance.getCurrentRoute).toHaveBeenCalledTimes(1)
    expect(updateUserSettings).toHaveBeenCalledTimes(1)
  })
})
