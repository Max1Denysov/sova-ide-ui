import React, { PureComponent } from 'react'
import Editors from '../editors'
import {
  EditorsContainerPreload,
  SettingsContainerPreload,
  DictionariesContainerPreload,
  CompilationContainerPreload,
} from '../../workarea/workareaRoutes'

class EditorsContainer extends PureComponent {
  componentDidMount() {
    EditorsContainerPreload.preload()
    SettingsContainerPreload.preload()
    DictionariesContainerPreload.preload()
    CompilationContainerPreload.preload()

    window.dispatchEvent(new Event('resize'))
  }

  render() {
    return (
      <section className="templatesFrame">
        <Editors />
      </section>
    )
  }
}

export default EditorsContainer
