import React, { PureComponent } from 'react'
import {
  EditorsContainerPreload,
  SettingsContainerPreload,
  DictionariesContainerPreload,
  CompilationContainerPreload,
} from '../../workarea/workareaRoutes'
import Settings from '../settings'

class SettingsContainer extends PureComponent {
  componentDidMount() {
    EditorsContainerPreload.preload()
    SettingsContainerPreload.preload()
    DictionariesContainerPreload.preload()
    CompilationContainerPreload.preload()
  }

  render() {
    return (
      <section className="settingsFrame">
        <Settings />
      </section>
    )
  }
}

export default SettingsContainer
