import React from 'react'
import { connect } from 'react-redux'
import { Transition, TransitionProps } from 'react-spring/renderprops'
import { ReduxState } from '../../store/store'

interface TransitionCustomProps extends TransitionProps<any> {
  animationEnabled: boolean
}

export const TransitionCustom = React.memo<TransitionCustomProps>(props => (
  <Transition {...props} config={props.animationEnabled ? { ...props.config } : { ...props.config, duration: 0 }} />
))

export const mapStateToProps = (state: ReduxState) => ({
  animationEnabled: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'animationEnabled',
    'value',
  ]),
})

TransitionCustom.displayName = 'TransitionCustom'

export default connect(mapStateToProps)(TransitionCustom)
