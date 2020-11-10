import React, { Component } from 'react'
import { history } from '../../store/store'

import defaultComponent from './defaultComponents'
import WorkareaEmpty from '../workarea/workareaEmpty/workareaEmpty'

type componentWithErrorType =
  | 'MenuPanelWithError'
  | 'MenuCompilationInfoWithError'
  | 'CompilationWithError'
  | 'DictionariesItemWithError'
  | 'HelpToolbarPinnedWithError'
  | 'ToolbarDictionariesListWithError'
  | 'ToolbarUserWithError'
  | 'MenuSearchDropDownWithError'
  | 'AppWithError'
  | 'ToolbarWithError'
  | 'WorkAreaWithError'
  | 'MenuWithError'

interface ErrorBoundaryProps {
  componentWithError?: componentWithErrorType
}
interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error | null | undefined) {
    // Update state so the next render will show the fallback UI.
    console.log(error)
    return { hasError: true }
  }

  componentDidCatch(error: Error | null | undefined, info: { componentStack: string }) {
    // You can also log the error to an error reporting service
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.componentWithError) {
        const componentWithError = this.props.componentWithError
        const { [componentWithError]: Component } = defaultComponent
        return <Component />
      }
      return <WorkareaEmpty>Error</WorkareaEmpty>
    }

    history.listen(() => {
      if (this.state.hasError) this.setState({ hasError: false })
    })

    return this.props.children
  }
}

export default ErrorBoundary
