import authMiddleware from './authMiddleware'
import errorMiddleware from './errorMiddleware'
import loadingGlobalFlagMiddleware from './loadingGlobalFlagMiddleware'

const middleware = {
  auth: authMiddleware,
  error: errorMiddleware,
  load: loadingGlobalFlagMiddleware,
}

export default middleware
