import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import settings from './reducers/settingsReducer'
import auth from './reducers/authReducer'
import statusbar from './reducers/statusbarReducer'
import toolbar from './reducers/toolbarReducer'
import menu from './reducers/menuReducer'
import editors from './reducers/editorsReducer'
import profiles from './reducers/profilesReducer'
import persistCrosstab from './utils/crosstabs'

const history = createBrowserHistory()

const reducer = combineReducers({
  router: connectRouter(history),
  auth,
  settings,
  statusbar,
  toolbar,
  menu,
  editors,
  profiles,
})

/** REDUX PERSIST */
const persistConfig = {
  transforms: [immutableTransform()],
  key: 'sova-ide',
  storage,
  debug: process.env.NODE_ENV !== 'production' ? true : false,
  whitelist: ['auth', 'toolbar', 'editors', 'profiles', 'settings'],
}

const persistedReducer = persistReducer(persistConfig, reducer)

const createStoreWithMiddleware = applyMiddleware(routerMiddleware(history))(createStore)

const store = createStoreWithMiddleware(
  persistedReducer,
  process.env.NODE_ENV !== 'production'
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : ''
)

const persistor = persistStore(store)
persistCrosstab(store, persistConfig, { blacklist: ['statusbar'] })

export type ReduxState = ReturnType<typeof persistedReducer>

export { store, history, persistor }
