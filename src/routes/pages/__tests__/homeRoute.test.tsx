import React from 'react'
import { shallow } from 'enzyme'
import HomeRoute from '../homeRoute'
import EmptyComponent from '../../../components/common/emptyComponent'

describe('HomeRoute tests', () => {
  it('*UNIT* renders without crashing', () => {
    const component = shallow(
      <HomeRoute toolbarFrame={EmptyComponent} workareaFrame={EmptyComponent} renderAccountsList={false} />
    )
    expect(component.exists()).toEqual(true)
  })
})