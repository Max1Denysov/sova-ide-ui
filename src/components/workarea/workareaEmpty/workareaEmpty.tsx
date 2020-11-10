import React from 'react'

interface WorkareaEmptyProps {
  children: React.ReactNode
}

const WorkareaEmpty = React.memo<WorkareaEmptyProps>(({ children }) => {
  return (
    <div className="workarea-empty-bg">
      {children}
    </div>
  )
})

export default WorkareaEmpty