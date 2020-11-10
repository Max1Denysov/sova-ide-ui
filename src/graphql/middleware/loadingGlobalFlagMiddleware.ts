import { ApolloLink, RequestHandler } from 'apollo-link'
import { Observable } from 'apollo-link'
import { setStatusBarSyncing } from '../../store/dispatcher'

const loadingGlobalFlagMiddleware = new ApolloLink(((operation: any, forward: any) => {
  const subscriber = forward(operation)
  const isSilent = !!(operation && operation.variables && operation.variables.silent)
  const loadingFlagOperationForward = new Observable(observer => {
    !isSilent && setStatusBarSyncing({ msg: 'Синхронизирую...' })
    subscriber.subscribe({
      next: (result: any) => {
        !isSilent && setStatusBarSyncing({ msg: 'Синхронизация завершена!' }, false)
        observer.next(result)
      },
      complete: observer.complete.bind(observer),
    })
  })

  return loadingFlagOperationForward
}) as RequestHandler)

export default loadingGlobalFlagMiddleware
