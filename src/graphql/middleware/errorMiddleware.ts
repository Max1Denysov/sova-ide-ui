import { onError } from 'apollo-link-error'
import { setStatusBarNotification } from '../../store/dispatcher'

const errorMiddleware = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      return setStatusBarNotification({ msg: `Message: ${message}`, className: 'error' })
    })

  if (networkError) console.log(`[Network error]: ${networkError}`)
  setStatusBarNotification({ msg: `Message: ${networkError}`, className: 'error' })
})

export default errorMiddleware
