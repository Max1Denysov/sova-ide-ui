import React from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { ReduxState } from '../../../store/store'
import { Map } from 'immutable'
import { editorsSortingConfig } from '../../../routes/configs/editorsConfig'
import { setEditorsSorting } from '../../../store/dispatcher'

interface EditorsSortingProps {
  editorsSorting: Map<any, any>
}

export const EditorsSorting = React.memo<EditorsSortingProps>(({ editorsSorting }) => {
  return (
    <div className="editorsSorting">
      <div className="editorsSorting-title">Сортировка:</div>
      {editorsSortingConfig.map((el, index) => {
        return (
          <button
            key={index}
            className={`editorsSorting-item sort-${el.type}${editorsSorting.get('type') === el.type ? ' active' : ''}`}
            onClick={() => setEditorsSorting(el.type)}
          >
            {el.title}
            {editorsSorting.get('type') === el.type && (
              <Icon icon={['fas', editorsSorting.get('isAsc') ? 'caret-up' : 'caret-down']}/>
            )}
          </button>
        )
      })}
    </div>
  )
})

export const mapStateToProps = (state: ReduxState) => ({
  editorsSorting: state.editors.get('editorsSorting'),
})

EditorsSorting.displayName = 'EditorsSorting'

export default connect(mapStateToProps)(EditorsSorting)