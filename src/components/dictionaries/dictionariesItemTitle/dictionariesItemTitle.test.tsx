import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { DictionariesItemTitle } from './dictionariesItemTitle'
import apolloClient from '../../../graphql/apolloClient'
import { Map } from 'immutable'

describe('DictionariesItemTitle tests', () => {
  let component: ShallowWrapper
  let instance: DictionariesItemTitle
  const propsMock = {
    client: apolloClient,
    title: 'title',
    id: 'id',
    selectedProfileId: 'selectedProfileId',
    currentUser: Map(),
  }

  beforeEach(() => {
    component = shallow(<DictionariesItemTitle {...propsMock} />)
    instance = component.instance() as DictionariesItemTitle
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the method with right arguments', () => {
    jest.spyOn(instance, 'editEnd').mockImplementation(jest.fn())
    instance.onEnter('Enter')
    expect(instance.editEnd).toHaveBeenCalledWith(false)
    instance.onEnter('Escape')
    expect(instance.editEnd).toHaveBeenCalledWith(true)
  })

  it('calls the method with right arguments', () => {
    jest.spyOn(instance, 'mutate').mockImplementation(jest.fn())
    instance.setState({ title: 'newTitle' })
    expect(instance.state.title).toEqual('newTitle')

    instance.editEnd(false)
    expect(instance.mutate).toHaveBeenCalledTimes(1)
  })

  it('updates the state correctly', () => {
    const newValue = 'newValue'
    component.find('.dict-title').simulate('click')
    expect(instance.state.editable).toEqual(true)
    component.find('input').simulate('change', { target: { value: newValue } })
    expect(instance.state.title).toEqual(newValue)
  })

  it('updates the state correctly', () => {
    component.find('.dict-title').simulate('click')
    jest.spyOn(document, 'addEventListener')
    jest.spyOn(document, 'removeEventListener')
    component.find('input').simulate('focus')
    component.find('input').simulate('blur')
    expect(document.addEventListener).toHaveBeenCalledTimes(1)
    expect(document.removeEventListener).toHaveBeenCalledTimes(1)
  })

  it('updates the state correctly', () => {
    component.find('.dict-title').simulate('click')
    expect(instance.state.editable).toEqual(true)
  })

  it('updates the state correctly', () => {
    component.find('.dict-title-btn').simulate('click')
    expect(instance.state.editable).toEqual(true)
  })

  it('calls the method with right arguments', () => {
    jest.spyOn(instance, 'editEnd').mockImplementation(jest.fn())
    component.setState({ editable: true })
    component.find('.dict-title-check').simulate('click')
    expect(instance.editEnd).toHaveBeenCalledWith(false)
  })

  it('calls the method with right arguments', () => {
    jest.spyOn(instance, 'editEnd').mockImplementation(jest.fn())
    component.setState({ editable: true })
    component.find('.dict-title-restore').simulate('click')
    expect(instance.editEnd).toHaveBeenCalledWith(true)
  })
})
