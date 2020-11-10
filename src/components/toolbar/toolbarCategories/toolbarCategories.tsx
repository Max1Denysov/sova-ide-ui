import React, { useState } from 'react'
import { templateActions } from '../../../routes/configs/toolbarConfig'
import ToolbarActions from '../toolbarActions/toolbarActions'
import ToolbarSuites from '../toolbarSuites/toolbarSuites'
import ToolbarDictionaries from '../toolbarDictionaries/toolbarDictionaries'
import ToolbarSearch from '../toolbarSearch/toolbarSearch'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { ReduxState } from '../../../store/store'
import { toggleHiddenDicts, toggleHiddenSuites } from '../../../store/dispatcher'

interface ToolbarCategoriesProps {
  dlReadOnly: boolean
  showHiddenSuites: boolean
  showHiddenDicts: boolean
}

export const ToolbarCategories = React.memo<ToolbarCategoriesProps>(({ dlReadOnly, showHiddenSuites, showHiddenDicts }) => {
  const [editorActive, setEditorToolbar] = useState(true)
  const [filterActive, setFilterActive] = useState(false)

  return (
    <ul className="toolbar-categories category-templates">
      <li className="toolbar-category active">
        <div className="toolbar-block-selector">
          <button
            onClick={() => setEditorToolbar(true)}
            className={`toolbar-category-toggle toolbar-category-toggle_tab${editorActive ? ' active' : ''}`}
          >
            Наборы
          </button>
          <button
            onClick={() => setEditorToolbar(false)}
            className={`toolbar-category-toggle toolbar-category-toggle_tab${!editorActive ? ' active' : ''}`}
          >
            Словари
          </button>
          <button
            onClick={() => editorActive ? toggleHiddenSuites(!showHiddenSuites) : toggleHiddenDicts(!showHiddenDicts)}
            className="toolbar-category-toggle toolbar-category-toggle_btn"
            title={`${editorActive 
              ? showHiddenSuites ? 'Скрыть' : 'Показать' 
              : showHiddenDicts ? 'Скрыть' : 'Показать'
            } недоступные ${editorActive ? 'наборы' : 'словари'}`}
          >
            <Icon
              icon={['far', editorActive
                ? showHiddenSuites ? 'eye-slash' : 'eye'
                : showHiddenDicts ? 'eye-slash' : 'eye'
              ]}
            />
          </button>
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`toolbar-category-toggle toolbar-category-toggle_btn${filterActive ? ' active' : ''}`}
            title="Фильтр"
          >
            <Icon icon={['fas', 'filter']}/>
          </button>
        </div>
        <div className="toolbar-category-inner">
          {filterActive && <ToolbarSearch category={editorActive ? 'suites' : 'dictionaries'}/>}
          {editorActive ? (
            <>
              <ToolbarSuites showHeader/>
              {!dlReadOnly && (
                <>
                  <ToolbarActions config={templateActions} renderForm/>
                </>
              )}
            </>
          ) : (
            <ToolbarDictionaries hideHeader={true}/>
          )}
        </div>
      </li>
    </ul>
  )
})

export const mapStateToProps = (state: ReduxState) => ({
  dlReadOnly: state.profiles.getIn(['selectedProfile', 'permissions', 'dl_write']) === false,
  showHiddenSuites: state.toolbar.get('showHiddenSuites'),
  showHiddenDicts: state.toolbar.get('showHiddenDicts'),
})

ToolbarCategories.displayName = 'ToolbarCategories'

export default connect(mapStateToProps)(ToolbarCategories)
