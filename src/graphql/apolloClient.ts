import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { split, from } from 'apollo-link'
import { CachePersistor, persistCache } from 'apollo-cache-persist'
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types'
import middleware from './middleware'
import { appDataUrl } from '../config/urlConfig'
import { createUploadLink } from 'apollo-upload-client'

const dataLink = createUploadLink({
  uri: appDataUrl,
})

const docsLink = createUploadLink({
  uri: appDataUrl,
})

const httpLink = split((operation) => operation.getContext().version === 1, docsLink, dataLink)

const cache = new InMemoryCache()

export const apolloPersistor = new CachePersistor({
  cache,
  storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
})

export const persistApolloCache = persistCache({
  cache,
  storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
})

const { auth, load, error } = middleware

const apolloClient = new ApolloClient({
  link: from([auth, load, error, httpLink]),
  cache,
  connectToDevTools: process.env.NODE_ENV !== 'production' ? true : false,
})

export default apolloClient
