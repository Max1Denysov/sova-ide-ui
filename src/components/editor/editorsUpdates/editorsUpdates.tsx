import React from 'react'
import { getDate } from '../../../utils/common'
import Icon from '../../common/icon'

interface EditorsUpdatesProps {
  lastUpdated: number
  lastUser: {
    uuid: string
    name: string
    username: string
    user_role: string
  } | null
}

const EditorsUpdates = React.memo<EditorsUpdatesProps>(({ lastUpdated, lastUser }) => {
  const date = getDate(lastUpdated, true)
  if (!lastUser) return <div className="editorUpdates" title="Последнее изменение">{date}</div>

  const nameToDisplay = () => {
    const name = lastUser.name || null
    const username = lastUser.username || null
    return name && username
      ? `${name} | ${username}`
      : name || username || ''
  }

  return (
    <div className="editorUpdates" title="Последнее изменение">
      <span>{nameToDisplay()}</span>
      <span>
        <Icon icon={['far', 'calendar-check']} props={{ size: 'sm' }} />
        {date}
      </span>
    </div>
  )
})

export default EditorsUpdates
