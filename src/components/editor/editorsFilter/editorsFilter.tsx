import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useInView } from 'react-intersection-observer'
import { setEditorsFilter } from '../../../store/dispatcher'
import { templatesFilter } from '../../../routes/configs/editorsConfig'
import OutBoundClick from '../../outboundClick/outBoundClick'
import { Map } from 'immutable'
import { ReduxState } from '../../../store/store'
import ToolbarSearch from '../../toolbar/toolbarSearch/toolbarSearch'
import Icon from '../../common/icon'

interface EditorsFilterProps {
  editorsFilter: Map<any, any>
}

export const EditorsFilter = React.memo<EditorsFilterProps>(({ editorsFilter }) => {
  let [isOpenFilter, setOpenFilter] = useState(false)
  let [isOpened, activate] = useState(true)

  const [ref, inView] = useInView({
    threshold: 0,
  })

  const showEditorsFilterItems = () => !inView && activate(!isOpened)

  const toggleOpenFilter = () => setOpenFilter(!isOpenFilter)

  return (
    <div className="editorsFilter">
      <OutBoundClick
        onClick={() => activate(true)}
        className="editorsFilter-status"
      >
        <span
          className={`editorsFilter-title${editorsFilter.includes(false) ? ' active' : ''}`}
          onClick={showEditorsFilterItems}
        >
          <span onClick={() => inView && editorsFilter.includes(false) && setEditorsFilter(null)}>
            {editorsFilter.includes(false) ? 'Отменить фильтр' : 'Фильтр по статусу'}
            <FontAwesomeIcon icon={['fas', 'caret-down']} />
          </span>
        </span>
        <div className={`editorsFilter-items-wrapper ${inView ? '' : !isOpened ? 'opened' : 'dropdown'}`}>
          {templatesFilter.map((item, index) => (
            <li
              key={index}
              className={`editorsFilter-item ${item.id}${editorsFilter.get(item.id) ? ' active' : ''}`}
              onClick={() => setEditorsFilter(item.id)}
            >
              {item.name}
            </li>
          ))}
        </div>
        <div ref={ref} className="anchor"/>
      </OutBoundClick>
      <div className="editorsFilter-name">
        {isOpenFilter && <ToolbarSearch category="editors" placeholder="Фильтр по заголовку" />}
        <button onClick={toggleOpenFilter} className="editors-toggle-btn filter" title="Фильтр по заголовку">
          <Icon icon={['fas', 'filter']} />
        </button>
      </div>
    </div>
  )
})
export const mapStateToProps = (state: ReduxState) => ({
  editorsFilter: state.editors.get('editorsFilter'),
})
EditorsFilter.displayName = 'EditorsFilter'
export default connect(mapStateToProps)(EditorsFilter)
