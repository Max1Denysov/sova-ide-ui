import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { LoginRoute } from '../loginRoute'
import apolloClient from '../../../graphql/apolloClient'

describe('LoginRoute tests', () => {
  let component: ShallowWrapper
  let instance: LoginRoute

  beforeEach(() => {
    component = shallow(<LoginRoute client={apolloClient} />)
    instance = component.instance() as LoginRoute
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })

  it('calls the right method on submit event', () => {
    jest.spyOn(instance, 'handleSubmit').mockImplementation(jest.fn())
    instance.forceUpdate()
    component.find('form').simulate('submit')
    expect(instance.handleSubmit).toHaveBeenCalledTimes(1)
  })
})