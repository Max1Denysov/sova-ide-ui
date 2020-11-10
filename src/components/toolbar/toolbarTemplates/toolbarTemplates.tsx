import React from 'react'
import Icon from '../../common/icon'
import { scrollToTemplate, setActiveTab, setPinnedTemplates } from '../../../store/dispatcher'
import { Map } from 'immutable'

interface ToolbarTemplateProps {
  isCollapsed: boolean
  suiteId: string
  templatesPinned: Map<any, any>
  isActiveTab: boolean
  animationEnabled: boolean
}

const ToolbarTemplates = React.memo<ToolbarTemplateProps>((
  {
    isActiveTab,
    suiteId,
    templatesPinned,
    isCollapsed
  }) => {
  const scrollTo = (templateId: string | null) => {
    if (!isActiveTab) setActiveTab(suiteId)
    scrollToTemplate(templateId)
  }

  const handleUnpin = (templateId: string) => setPinnedTemplates(suiteId, templateId, null)

  return isCollapsed ? (
    <ul className="toolbar-file-templates">
      {templatesPinned.toList().map((template: Map<any, any>) => (
        <li
          key={template.get('id')}
          className={`toolbar-file-template${template.get('is_enabled') ? ' enabled' : ' disabled'}`}
          title={template.getIn(['meta', 'title']) || '(без названия)'}
        >
          <button className="toolbar-file-template-goto" onClick={() => scrollTo(template.get('id'))} />
          <button
            className="toolbar-file-template-unpin"
            title="Удалить из избранных шаблонов"
            onClick={() => handleUnpin(template.get('id'))}
          >
            <Icon icon={['fas', 'thumbtack']} />
          </button>
          <span>{template.getIn(['meta', 'title']) || '(без названия)'}</span>
        </li>
      ))}
    </ul>
  ) : null
})

ToolbarTemplates.displayName = 'ToolbarTemplates'

export default ToolbarTemplates
