import React from 'react'
import ErrorBoundary from '../errorBoundary/errorBoundary'

interface WorkareaProps {
  workareaFrame: React.ComponentType
  isChatDisabled?: boolean
}

const Workarea = React.memo<WorkareaProps>(({ workareaFrame: WorkareaFrame }) => {
  return (
    <section className="workarea">
      <ErrorBoundary>
        <WorkareaFrame />
      </ErrorBoundary>
    </section>
  )
})

Workarea.displayName = 'Workarea'

export default Workarea
