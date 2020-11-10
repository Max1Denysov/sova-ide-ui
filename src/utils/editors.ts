import { scrollToTemplate, setActiveTab, setOpenedTabs } from '../store/dispatcher'
import { store } from '../store/store'

const goToTemplate = (templateId: string, suiteId: string, suiteTitle?: string) => {
  const selectedProfile = store.getState().profiles.get('selectedProfile')
  const activeTab = store.getState().editors.get('activeTab')
  const openedTabs = store.getState().editors.get('openedTabs')
  setTimeout(() => {
    if (
      !openedTabs ||
      !openedTabs.has(selectedProfile.id) ||
      !openedTabs.get(selectedProfile.id).has(suiteId)
    ) {
      setOpenedTabs(selectedProfile.id, suiteId, Date.now(), suiteTitle || '')
    }
    if (activeTab !== suiteId) setActiveTab(suiteId)
    if (templateId) scrollToTemplate(templateId)
  }, 500)
}

export { goToTemplate }