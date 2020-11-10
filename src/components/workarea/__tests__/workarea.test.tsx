import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import Workarea from '../workarea'
import CustomRoute from '../../common/customRoute'

describe('Workarea tests', () => {
  let component: ShallowWrapper
  const compMock = React.memo(() => <div>TEST</div>)
  const propsMock = {
    workareaFrame: compMock,
  }

  beforeEach(() => {
    component = shallow(<Workarea {...propsMock} />)
  })

  it('*UNIT* renders without crashing', () => {
    expect(component.exists()).toEqual(true)
  })
})
