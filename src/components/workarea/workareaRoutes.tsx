import React from 'react'
import lazyWithPreload from '../../utils/lazyPreload'

export const EditorsContainerPreload = lazyWithPreload(
  () => import(/* webpackChunkName: 'templatesPage' */ '../editor/editorsContainer/editorsContainer')
)

export const SettingsContainerPreload = lazyWithPreload(
  () => import(/* webpackChunkName: 'settingsPage' */ '../settings/settingsContainer/settingsContainer')
)

export const DictionariesContainerPreload = lazyWithPreload(
  () => import(/* webpackChunkName: 'dictionariesPage' */ '../dictionaries/dictionariesContainer/dictionariesContainer')
)

export const CompilationContainerPreload = lazyWithPreload(
  () => import(/* webpackChunkName: 'compilationPage' */ '../compilation/compilationContainer/compilationContainer')
)

export const TemplatesFrame = React.memo(() => <EditorsContainerPreload />)
export const DictionariesFrame = React.memo(() => <DictionariesContainerPreload />)
export const SettingsFrame = React.memo(() => <SettingsContainerPreload />)
export const CompilationFrame = React.memo(() => <CompilationContainerPreload />)
