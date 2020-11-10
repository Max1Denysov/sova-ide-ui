import React, { PureComponent } from 'react'
import {
  EditorsContainerPreload,
  SettingsContainerPreload,
  DictionariesContainerPreload,
  CompilationContainerPreload,
} from '../../workarea/workareaRoutes'
import Dictionaries from '../dictionaries'

class DictionariesContainer extends PureComponent {
  componentDidMount() {
    EditorsContainerPreload.preload()
    SettingsContainerPreload.preload()
    DictionariesContainerPreload.preload()
    CompilationContainerPreload.preload()

    window.dispatchEvent(new Event('resize'))
  }

  render() {
    return (
      <section className="dictionariesFrame">
        <Dictionaries />
      </section>
    )
  }
}

export default DictionariesContainer
