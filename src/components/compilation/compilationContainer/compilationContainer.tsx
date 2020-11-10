import React, { PureComponent } from 'react'
import {
  EditorsContainerPreload,
  SettingsContainerPreload,
  DictionariesContainerPreload,
  CompilationContainerPreload,
} from '../../workarea/workareaRoutes'
import Compilation from '../compilation'
import ErrorBoundary from '../../errorBoundary/errorBoundary'

export class CompilationContainer extends PureComponent {
  componentDidMount() {
    EditorsContainerPreload.preload()
    SettingsContainerPreload.preload()
    DictionariesContainerPreload.preload()
    CompilationContainerPreload.preload()
  }

  render() {
    return (
      <section className="compilationFrame">
        <ErrorBoundary componentWithError="CompilationWithError">
          <Compilation />
        </ErrorBoundary>
      </section>
    )
  }
}

export default CompilationContainer
