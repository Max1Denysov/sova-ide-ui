import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import DictionariesActions from './dictionariesActions'
import { dictActions } from '../../../routes/configs/dictionariesConfig'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faTrashAlt,
  faPowerOff,
  faBookmark,
  faBan,
  faCommentDots,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons'
import { faSave, faCalendarCheck } from '@fortawesome/free-regular-svg-icons'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
library.add(faPlus, faTrashAlt, faPowerOff, faBookmark, faSave, faBan, faCommentDots, faCaretDown, faCalendarCheck)

describe('EditorsActionsDictionaries tests ', () => {
  let component: ShallowWrapper
  const propsMock = {
    forwardedRef: React.createRef<HTMLButtonElement>(),
    saved: true,
    selectMutation: jest.fn(),
    handleAction: jest.fn(),

    lastUpdated: 2,
    lastUser: {
      uuid: 'string',
      name: 'string',
      username: 'string',
      user_role: 'string',
    },
  }

  beforeEach(() => {
    component = shallow(
      <Provider store={store}>
        <DictionariesActions {...propsMock} />
      </Provider>
    )
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  /* it('calls the action by name from config', () => {
    component.find('.editorActionsBtnWrapper').first().simulate('click')
    expect(propsMock.handleAction).toHaveBeenCalled()
    expect(propsMock.handleAction).toHaveBeenCalledWith(dictActions[0].name)
  })

  it('selects mutation by name from config', () => {
    expect(propsMock.selectMutation).toHaveBeenCalled()
  }) */

  it('renders the component correctly ', () => {
    const mounted = mount(
      <Provider store={store}>
        <DictionariesActions {...propsMock} />
      </Provider>
    )
    expect(mounted.find('.editorActions')).toHaveLength(1)
  })

  it('renders the component correctly', () => {
    const mounted = mount(
      <Provider store={store}>
        <DictionariesActions {...propsMock} />
      </Provider>
    )

    dictActions.forEach((item) => {
      const btn = mounted.find('.editorActionsBtn.' + item.name)
      if (btn.length) {
        btn.simulate('click')
        expect(propsMock.handleAction).toHaveBeenCalledWith(item.name)
      }
    })
  })
})
