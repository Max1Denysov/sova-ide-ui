import React from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import DictionariesEditor from './dictionariesEditor'
import { Map } from 'immutable'
import { InView } from 'react-intersection-observer'

describe('DictionariesEditor tests', () => {
  let component: ShallowWrapper

  let instance: DictionariesEditor
  const propsMock = {
    id: 'id',
    code: 'code',
    description: 'description',
    common: false,
    content: 'content',
    updated: 2,
    selectedProfileId: 'selectedProfileId',
    profile_ids: ['id1'],
    lastUser: {
      uuid: 'uuid',
      name: 'name',
      username: 'username',
      user_role: 'roleName',
    },
    currentUser: Map(),
    isEditorsPage: true,
    dictAnimationFinish: true,
    isEnabled: true,
    showLinesCount: true,
    showDescription: true,
    inView: true,
    ref: 't',
  }

  function setupIntersectionObserverMock({ observe = () => null, unobserve = () => null } = {}) {
    class IntersectionObserver {
      observe = observe
      unobserve = unobserve
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserver,
    })
    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserver,
    })
  }

  beforeEach(() => {
    setupIntersectionObserverMock()
    component = shallow(<DictionariesEditor {...propsMock} />)
    instance = component.instance() as DictionariesEditor
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing', () => {
    const wrapper = mount(<DictionariesEditor {...propsMock} />)
    //console.log(wrapper.debug())
    expect(wrapper.find('.editorItem').length).toBe(1)
  })
})
