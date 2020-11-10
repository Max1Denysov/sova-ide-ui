import React from 'react'
import ToolbarLinks from '../toolbarLinks/toolbarLinks'
import ToolbarProfile from '../toolbarProfile/toolbarProfile'

const ToolbarControl = React.memo(() => (
  <section className="toolbar-control">
    <ToolbarLinks />
    <ToolbarProfile />
  </section>
))

ToolbarControl.displayName = 'ToolbarControl'

export default ToolbarControl
