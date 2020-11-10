import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import defaultComponents from './defaultComponents'

describe('DefaultComponents tests ', () => {
  let MenuPanelWithError: ShallowWrapper
  let MenuCompilationInfoWithError: ShallowWrapper
  let CompilationWithError: ShallowWrapper
  let DictionariesItemWithError: ShallowWrapper
  let HelpToolbarPinnedWithError: ShallowWrapper
  let ToolbarDictionariesListWithError: ShallowWrapper
  let ToolbarUserWithError: ShallowWrapper
  let MenuSearchDropDownWithError: ShallowWrapper
  let AppWithError: ShallowWrapper
  let MenuWithError: ShallowWrapper
  let ToolbarWithError: ShallowWrapper
  let WorkAreaWithError: ShallowWrapper

  beforeEach(() => {
    MenuPanelWithError = shallow(<defaultComponents.MenuPanelWithError />)
    MenuCompilationInfoWithError = shallow(<defaultComponents.MenuCompilationInfoWithError />)
    CompilationWithError = shallow(<defaultComponents.CompilationWithError />)
    DictionariesItemWithError = shallow(<defaultComponents.DictionariesItemWithError />)
    HelpToolbarPinnedWithError = shallow(<defaultComponents.HelpToolbarPinnedWithError />)
    ToolbarDictionariesListWithError = shallow(<defaultComponents.ToolbarDictionariesListWithError />)
    ToolbarUserWithError = shallow(<defaultComponents.ToolbarUserWithError />)
    MenuSearchDropDownWithError = shallow(<defaultComponents.MenuSearchDropDownWithError />)
    AppWithError = shallow(<defaultComponents.AppWithError />)
    MenuWithError = shallow(<defaultComponents.MenuWithError />)
    ToolbarWithError = shallow(<defaultComponents.ToolbarWithError />)
    WorkAreaWithError = shallow(<defaultComponents.WorkAreaWithError />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(MenuPanelWithError.exists()).toEqual(true)
    expect(MenuCompilationInfoWithError.exists()).toEqual(true)
    expect(CompilationWithError.exists()).toEqual(true)
    expect(DictionariesItemWithError.exists()).toEqual(true)
    expect(HelpToolbarPinnedWithError.exists()).toEqual(true)
    expect(ToolbarDictionariesListWithError.exists()).toEqual(true)
    expect(ToolbarUserWithError.exists()).toEqual(true)
    expect(MenuSearchDropDownWithError.exists()).toEqual(true)
    expect(AppWithError.exists()).toEqual(true)
    expect(MenuWithError.exists()).toEqual(true)
    expect(ToolbarWithError.exists()).toEqual(true)
    expect(WorkAreaWithError.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different state', () => {
    DictionariesItemWithError.find('button').simulate('click')
    expect(DictionariesItemWithError.exists()).toEqual(true)
  })

  it('*UNIT* renders without crashing with different state', () => {
    MenuSearchDropDownWithError.find('.dropdown').simulate('click')
    expect(MenuSearchDropDownWithError.exists()).toEqual(true)
  })
})
