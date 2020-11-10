import React from 'react'

interface ToggleProps {
  id?: string
  value: boolean
  handler(): void
  disabled?: boolean
}

const Toggle = React.memo<ToggleProps>(({ id, value, handler, disabled }) => {
  return (
    <div className={`toggle${disabled ? ' disabled' : ''}`}>
      <input
        type="checkbox"
        className="toggle-input"
        id={id}
        checked={value}
        onChange={disabled ? () => {} : handler}
      />
      <label className="toggle-label" htmlFor={id} />
    </div>
  )
})

Toggle.displayName = 'Toggle'

export default Toggle
