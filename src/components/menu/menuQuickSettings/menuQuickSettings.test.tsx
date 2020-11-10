import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { MenuQuickSettings, mapStateToProps } from './menuQuickSettings'
import { Map, fromJS } from 'immutable'
import { updateUserSettings } from '../../../store/dispatcher'

jest.mock('../../../store/dispatcher')

describe('MenuLogo tests ', () => {
  let component: ShallowWrapper
  const propsMock = {
    settingsRoute: 'common',
    settingsGroup: 'visual',
  }

  const reduxMock = {
    userSettings: Map({
      common: {
        visual: {
          title: 'Визуальное оформление',
          subtitle: 'Влияют на внешний вид ARM NX и его элементов',
          clientSettings: {
            colorTheme: {
              value: {
                name: 'Тёмная',
                value: 'theme1',
              },
            },
            fontFamily: {
              value: {
                name: 'Roboto (по умолчанию)',
                value: 'roboto',
              },
            },
            fontSize: {
              value: {
                name: '12px (по умолчанию)',
                value: '12',
              },
            },
            animationEnabled: {
              value: true,
            },
            editorsOpened: {
              value: false,
            },
            favTemplatesExpanded: {
              value: false,
            },
            commentsExpanded: {
              value: false,
            },
            showLinesCount: {
              value: true,
            },
          },
          params: {
            colorTheme: {
              type: 'select',
              id: 'colorTheme',
              name: 'Тема оформления',
              options: [
                {
                  name: 'Тёмная',
                  value: 'theme1',
                },
                {
                  name: 'Голубая',
                  value: 'theme2',
                },
                {
                  name: 'Розовая',
                  value: 'theme3',
                },
                {
                  name: 'Светлая',
                  value: 'theme4',
                },
                {
                  name: 'Бордовая',
                  value: 'theme5',
                },
                {
                  name: 'Песочная',
                  value: 'theme6',
                },
                {
                  name: 'Темно-синяя',
                  value: 'theme7',
                },
              ],
            },
            fontFamily: {
              type: 'select',
              id: 'fontFamily',
              name: 'Основной шрифт',
              options: [
                {
                  name: 'Alegreya Sans',
                  value: 'alegreyasans',
                },
                {
                  name: 'Arimo',
                  value: 'arimo',
                },
                {
                  name: 'Cuprum',
                  value: 'cuprum',
                },
                {
                  name: 'Fira Sans',
                  value: 'firasans',
                },
                {
                  name: 'Montserrat',
                  value: 'montserrat',
                },
                {
                  name: 'Noto Sans',
                  value: 'notosans',
                },
                {
                  name: 'Nunito',
                  value: 'nunito',
                },
                {
                  name: 'Roboto (по умолчанию)',
                  value: 'roboto',
                },
                {
                  name: 'Rubik',
                  value: 'rubik',
                },
                {
                  name: 'Ubuntu',
                  value: 'ubuntu',
                },
                {
                  name: 'Whitney',
                  value: 'whitney',
                },
              ],
            },
            fontSize: {
              type: 'select',
              id: 'fontSize',
              name: 'Базовый размер шрифта',
              options: [
                {
                  name: '10px',
                  value: '10',
                },
                {
                  name: '11px',
                  value: '11',
                },
                {
                  name: '12px (по умолчанию)',
                  value: '12',
                },
                {
                  name: '13px',
                  value: '13',
                },
                {
                  name: '14px',
                  value: '14',
                },
                {
                  name: '15px',
                  value: '15',
                },
                {
                  name: '16px',
                  value: '16',
                },
              ],
            },
            animationEnabled: {
              type: 'toggle',
              id: 'animationEnabled',
              name: 'Анимация',
              value: true,
            },
          },
        },
        editors: {
          title: 'Настройки текстовых редакторов',
          subtitle: 'Влияют на базовое отображение редакторов шаблонов и словарей',
          params: {
            editorsOpened: {
              type: 'toggle',
              id: 'editorsOpened',
              name: 'Шаблоны отображаются в раскрытом виде',
              value: false,
            },
            favTemplatesExpanded: {
              type: 'toggle',
              id: 'favTemplatesExpanded',
              name: 'Избранные шаблоны отображаются в раскрытом виде',
              value: false,
            },
            commentsExpanded: {
              type: 'toggle',
              id: 'commentsExpanded',
              name: 'Построчные комментарии по умолчанию раскрыты',
              value: false,
            },
            showLinesCount: {
              type: 'toggle',
              id: 'showLinesCount',
              name: 'Отображать нумерацию строк в редакторах',
              value: true,
            },
          },
        },
      },
      profile: {
        user: {
          isUser: true,
          title: 'Настройки профиля',
          subtitle: 'Настройки аккаунта пользователя',
          params: {
            userAvatar: {
              sort: 1,
              type: 'avatar',
              id: 'userAvatar',
              name: 'Аватар',
              value: '../../../assets/images/avatar.jpeg',
            },
            name: {
              sort: 2,
              type: 'input',
              id: 'name',
              name: 'Имя',
              value: 'Пользователь',
            },
            username: {
              sort: 3,
              type: 'input',
              id: 'username',
              name: 'Логин',
              value: 'user',
              disabled: true,
            },
            email: {
              sort: 4,
              type: 'input',
              id: 'email',
              name: 'E-mail',
              value: 'user@nanosemantics.ai',
              disabled: true,
            },
            uuid: {
              sort: 5,
              type: 'input',
              id: 'uuid',
              name: 'UUID',
              value: 'userId-userId-userId-userId',
              disabled: true,
            },
            role: {
              sort: 6,
              type: 'input',
              id: 'role',
              name: 'Роль пользователя',
              value: 'Администратор',
              disabled: true,
            },
            accounts: {
              sort: 7,
              type: 'badges',
              id: 'accounts',
              name: 'Аккаунты пользователя',
              value: ['Аккаунт_1', 'Аккаунт_2'],
            },
            groups: {
              sort: 8,
              type: 'badges',
              id: 'groups',
              name: 'Группы пользователя',
              value: ['Группа_1', 'Группа_2'],
            },
          },
        },
      },
    }),
  }
  const stateMock = {
    settings: Map(
      fromJS({
        userSettings: reduxMock.userSettings,
      })
    ),
  }

  beforeEach(() => {
    component = shallow(<MenuQuickSettings {...propsMock} {...reduxMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    component.setProps({ settingsRoute: 'profile', settingsGroup: 'user' })
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different props', () => {
    const wrapper = mount(<MenuQuickSettings {...propsMock} {...reduxMock} />)
    wrapper.setProps({ settingsRoute: 'profile', settingsGroup: 'user' })
    //console.log(wrapper.debug())
    expect(wrapper.find('.subnav-item').length).toBe(0)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(reduxMock)
  })
})
