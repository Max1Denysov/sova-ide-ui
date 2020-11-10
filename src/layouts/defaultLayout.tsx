import React, { Suspense } from 'react'
import HomeLoader from '../components/loaders/homeLoader'
import { connect } from 'react-redux'
import StatusBar from '../components/statusBar/statusBar'
import { ReduxState } from '../store/store'

interface DefaultLayoutProps {
  currentTheme: string
  animationEnabled: boolean
  fontFamily: string
  fontSize: string
}

export const DefaultLayout = React.memo<DefaultLayoutProps>(
  ({ currentTheme, animationEnabled, fontFamily, fontSize, children }) => {
    return (
      <div
        className={`App ${currentTheme || 'theme1'}${!animationEnabled ? ' no-animation' : ''} font-${fontFamily || 'roboto'} text-${fontSize || '12'}`}
      >
        <Suspense fallback={<HomeLoader />}>{children}</Suspense>
        <StatusBar syncOnly />
        <StatusBar />
      </div>
    )
  }
)

export const mapStateToProps = (state: ReduxState) => ({
  currentTheme: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'colorTheme',
    'value',
    'value',
  ]),
  animationEnabled: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'animationEnabled',
    'value',
  ]),
  fontFamily: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'fontFamily',
    'value',
    'value',
  ]),
  fontSize: state.settings.getIn(['userSettings', 'common', 'visual', 'clientSettings', 'fontSize', 'value', 'value']),
})

export default connect(mapStateToProps)(DefaultLayout)
