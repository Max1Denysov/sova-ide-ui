import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import Icon from '../icon'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

describe('Icon tests', () => {
  let component: ShallowWrapper
  const propsMock = {
    icon: ['fas', 'times'] as [IconPrefix, IconName],
    props: {
      size: 'lg'
    },
    className: 'class'
  }

  beforeEach(() => {
    component = shallow(<Icon {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})