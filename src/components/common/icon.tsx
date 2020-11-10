import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

interface IconProps {
  icon: [IconPrefix, IconName]
  className?: string
  props?: object
}

const Icon = React.memo<IconProps>(props => (
  <FontAwesomeIcon className={props.className} icon={props.icon} {...props.props} />
))

Icon.displayName = 'Icon'

export default Icon
