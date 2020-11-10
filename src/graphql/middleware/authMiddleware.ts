import { setContext } from 'apollo-link-context'
import { store } from '../../store/store'

const authMiddleware = setContext((_, previousContext) => {
  const token = store.getState().auth.get('token')
  return {
    headers: {
      ...previousContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export default authMiddleware
