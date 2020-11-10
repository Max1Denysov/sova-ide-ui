import React from 'react'
import ToolbarUtilities from '../toolbarUtilities/toolbarUtilities'

interface ToolbarContentProps {
  toolbarFrame: React.ComponentType
  isUtilityEnabled?: boolean
}

const ToolbarContent = React.memo<ToolbarContentProps>(({ toolbarFrame: ToolbarFrame, isUtilityEnabled }) => {
  return (
    <section className="toolbar-content">
      {!!isUtilityEnabled ? <ToolbarUtilities/> : <ToolbarFrame/>}
    </section>
  )
})

ToolbarContent.displayName = 'ToolbarContent'

export default ToolbarContent
