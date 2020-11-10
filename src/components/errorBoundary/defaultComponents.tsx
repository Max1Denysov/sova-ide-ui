import React, { useState } from 'react'
import MenuSelect from '../menu/menuSelect/menuSelect'
import Icon from '../common/icon'
import OutBoundClick from '../outboundClick/outBoundClick'
import { Provider } from 'react-redux'
import { store, history, persistor } from '../../store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router'
import { Router } from 'react-router'
import SwitchAuth from '../switchAuth/switchAuth'
import WorkareaEmpty from '../workarea/workareaEmpty/workareaEmpty'

const MenuPanelWithError = React.memo(() => (
  <div className="menu-panel">
    <MenuSelect
      items={[
        {
          id: '1',
          name: 'ERROR',
          is_enabled: false,
          permissions: {
            dl_read: false,
            dl_write: false,
            dict_read: false,
            dict_write: false,
          },
        },
      ]}
    />
  </div>
))
const MenuCompilationInfoWithError = React.memo(() => (
  <div className="menu-compilation-info">
    <div className="menu-compilation-wrapper">Error</div>
  </div>
))

const CompilationWithError = React.memo(() => (
  <section className="compilation">
    <div className="compilation-tasks-title">Версии компиляции</div>
    <WorkareaEmpty>Error</WorkareaEmpty>
  </section>
))

const DictionariesItemWithError = React.memo(() => {
  const [hide, setCount] = useState(false)
  return !hide ? (
    <div className="dict-item enabled">
      <div className="dict-header">
        <span className="dict-title">Error</span>
        <button className="dict-header-btn" title="Закрыть словарь" onClick={() => setCount(true)}>
          <Icon icon={['fas', 'times']} />
        </button>
      </div>
      <div className="dict-main">
        <div className="editorContent-error">
          <WorkareaEmpty>Error</WorkareaEmpty>
        </div>
      </div>
    </div>
  ) : null
})

const HelpToolbarPinnedWithError = React.memo(() => <div className="toolbar-no-filtered-info">Error</div>)

const ToolbarDictionariesListWithError = React.memo(() => (
  <div className="toolbar-file-header">
    <div className="toolbar-file-toggle">
      <div className="toolbar-no-filtered-info">Error</div>
    </div>
  </div>
))

const ToolbarUserWithError = React.memo(() => <div className="toolbar-no-filtered-info">Error</div>)

const MenuSearchDropDownWithError = React.memo(() => (
  <OutBoundClick
    className="dropdown"
    exceptions={['menu-search-input', 'menu-search-clear']}
    onClick={() => 'defaultReturn'}
  >
    <div className="dropdown-item not-found">Error</div>
  </OutBoundClick>
))

const MenuWithError = React.memo(() => (
  <header className="menu">
    <div className="toolbar-no-filtered-info">Error</div>
  </header>
))

const ToolbarWithError = React.memo(() => <div className="toolbar-no-filtered-info">Error</div>)

const WorkAreaWithError = React.memo(() => <WorkareaEmpty>Error</WorkareaEmpty>)

const AppWithError = React.memo(() => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <Router history={history}>
          <SwitchAuth hasError={true} />
        </Router>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
))

const defaultComponent = {
  MenuPanelWithError,
  MenuCompilationInfoWithError,
  CompilationWithError,
  DictionariesItemWithError,
  HelpToolbarPinnedWithError,
  ToolbarDictionariesListWithError,
  ToolbarUserWithError,
  MenuSearchDropDownWithError,
  AppWithError,
  MenuWithError,
  ToolbarWithError,
  WorkAreaWithError,
}

export default defaultComponent
