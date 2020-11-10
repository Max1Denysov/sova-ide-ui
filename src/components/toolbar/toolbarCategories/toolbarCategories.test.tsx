import React, { useState as useStateMock } from 'react'
import { shallow, ShallowWrapper, mount } from 'enzyme'
import { ToolbarCategories, mapStateToProps } from './toolbarCategories'
import { Map } from 'immutable'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
import { ApolloProvider } from 'react-apollo'
import apolloClient from '../../../graphql/apolloClient'
import { faFilter, faBan, faTimesCircle, faDotCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, faSave } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { toggleHiddenDicts, toggleHiddenSuites } from '../../../store/dispatcher'
library.add(faFilter, faEyeSlash, faBan, faSave, faTimesCircle, faDotCircle, faPlusCircle)

describe('ToolbarCategories tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    dlReadOnly: false,
    showHiddenSuites: true,
    showHiddenDicts: true,
  }
  const stateMock = {
    profiles: Map({
      selectedProfile: {
        permissions: {
          dl_write: true,
        },
      },
    }),
    toolbar: Map({
      showHiddenSuites: propsMock.showHiddenSuites,
      showHiddenDicts: propsMock.showHiddenDicts,
    }),
  }

  beforeEach(() => {
    component = shallow(<ToolbarCategories {...propsMock} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('gets props from ReduxState properly', () => {
    expect(mapStateToProps(stateMock as any)).toEqual(propsMock)
  })

  it('renders correctly on click ', () => {
    component.find('.toolbar-category-toggle').first().simulate('click')
    expect(component.exists()).toEqual(true)
    component.find('.toolbar-category-toggle').last().simulate('click')
    expect(component.exists()).toEqual(true)
  })

  it('test setEditorToolbar', () => {
    const props = {
      editorActive: true,
    }
    const wrapper = mount(
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <ToolbarCategories {...propsMock} {...props} />
        </Provider>
      </ApolloProvider>
    )
    wrapper.find('.toolbar-category-toggle.toolbar-category-toggle_tab').at(1).simulate('click')
    //wrapper.find('.toolbar-category-toggle.toolbar-category-toggle_btn"').at(1).simulate('click')
    expect(toggleHiddenSuites(!propsMock.showHiddenSuites)).toEqual({
      type: 'TOOLBAR/TOGGLE_HIDDEN_SUITES',
      value: false,
    })
    expect(toggleHiddenDicts(!propsMock.showHiddenDicts)).toEqual({
      type: 'TOOLBAR/TOGGLE_HIDDEN_DICTS',
      value: false,
    })
    //expect(setState).toHaveBeenCalledTimes(0)
  })
})
