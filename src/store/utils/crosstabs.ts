import { KEY_PREFIX, REHYDRATE } from 'redux-persist/lib/constants'
import Serialize from 'remotedev-serialize'
import Immutable from 'immutable'
import { RandomObject } from '../../@types/common'

const { stringify, parse } = Serialize.immutable(Immutable)

const persistCrosstab = (store: RandomObject, persistConfig: RandomObject, crosstabConfig: RandomObject = {}) => {
  const blacklist = crosstabConfig.blacklist || null
  const whitelist = crosstabConfig.whitelist || null
  const keyPrefix = crosstabConfig.keyPrefix || KEY_PREFIX

  const { key } = persistConfig

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(ev: StorageEvent) {
    if (ev.key && ev.key.indexOf(keyPrefix) === 0) {
      if (ev.oldValue === ev.newValue) {
        return
      }

      const statePartial = ev.newValue ? JSON.parse(ev.newValue) : ''

      const state = Object.keys(statePartial).reduce((state: RandomObject, reducerKey) => {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return state
        }
        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return state
        }

        state[reducerKey] = JSON.parse(statePartial[reducerKey])
        state[reducerKey] = stringify(JSON.parse(state[reducerKey]))
        state[reducerKey] = parse(state[reducerKey])
        return state
      }, {})

      store.dispatch({
        key,
        payload: state,
        type: REHYDRATE,
      })
    }
  }
}

export default persistCrosstab
