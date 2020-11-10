import React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'
import { EditorsActions } from './editorsActions'
import { editorActions } from '../../../routes/configs/editorsConfig'
import { Map, fromJS } from 'immutable'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faTrashAlt,
  faPowerOff,
  faBookmark,
  faBan,
  faCommentDots,
  faCopy,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { Editor } from 'draft-js'
library.add(faPlus, faTrashAlt, faPowerOff, faBookmark, faSave, faBan, faCommentDots, faCopy, faCommentSlash)

jest.mock('../../../store/dispatcher')

describe('EditorsActions tests ', () => {
  let component: ShallowWrapper
  let instance: EditorsActions
  const propsMock = {
    forwardedRef: React.createRef<HTMLButtonElement>(),
    text: 'test',
    selectedProfileId: 'selectedProfileId',
    suiteId: 'suiteId',
    template: {
      id: 'templateId',
      position: 1,
      content: 'content',
      created: 1,
      updated: 2,
      is_enabled: true,
      profile_id: 'string',
      suite_id: 'string',
      suite_title: 'string',
      meta: {
        title: 'title',
        description: 'description',
        last_user: null,
      },
      stats: {
        last_used: 'last_used',
        used_7d: 0,
        used_30d: 1,
      },
    },
    description: 'description',
    isPinned: false,
    saved: false,
    showFullscreen: false,
    editorRef: React.createRef<Editor>(),
    containerRef: React.createRef<HTMLDivElement>(),
    currentUser: Map(
      fromJS({
        id: 'id',
        name: 'name',
        username: 'username',
        role: {
          id: 2,
          name: 'User',
        },
      })
    ),
    positionSortingEnabled: true,
    sortingDirectionIsAsc: true,
    activeSearchResult: Map(),
    stateHandlers: {
      discardHandler: jest.fn(),
      saveHandler: jest.fn(),
    },
  }

  beforeEach(() => {
    component = shallow(<EditorsActions {...propsMock} />)
    instance = component.instance() as EditorsActions
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('selects mutations by config properly', () => {
    jest.spyOn(instance, 'selectMutation')
    instance.forceUpdate()
    expect(instance.selectMutation).toHaveBeenCalledTimes(editorActions.length)
  })
})
