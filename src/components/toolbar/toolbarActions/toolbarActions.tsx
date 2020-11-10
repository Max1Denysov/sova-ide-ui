import React, { useRef } from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import {
  selectUnselectSuites,
  setStatusBarNotification,
  setPinnedTemplates,
  closeOpenedTab,
  selectUnselectDictionaries,
  closeDictionary,
  setActiveTab,
  setCustomConfirmConfig,
} from '../../../store/dispatcher'
import { withApollo } from 'react-apollo'
import {
  SUITE_CREATE_MUTATION,
  SUITE_REMOVE_MUTATION,
  SUITE_MULTIPLE_UPDATE_MUTATION,
} from '../../../graphql/queries/suitesQuery'
import {
  DICTIONARY_CREATE_MUTATION,
  DICTIONARY_REMOVE_MUTATION,
  DICTIONARY_MULTIPLE_UPDATE_MUTATION,
} from '../../../graphql/queries/dictionariesQueries'
import { Map, Set, List } from 'immutable'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import { ReduxState } from '../../../store/store'
import ApolloClient from 'apollo-client'
import { getDictsRefetchData, getSuitesRefetchData } from '../../../utils/queries'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { notifyWithDelay } from '../../../utils/common'
import CustomConfirm from '../../common/customConfirm'

interface ToolbarActionsProps {
  client: ApolloClient<NormalizedCacheObject>
  config: {
    title: string
    name: string
    icon: [IconPrefix, IconName]
    iconProps?: object
    color?: string
  }[]
  currentPath: string
  selectedProfileId: string
  selectedSuites: Map<any, any>
  renderForm?: boolean
  alwaysShow?: boolean
  templatesPinned: Map<any, any>
  openedTabs: Map<any, any>
  currentUser: Map<any, any>
  selectedDictionaries: Map<any, any>
}

export const ToolbarActions = React.memo<ToolbarActionsProps>(
  ({
    client,
    config,
    currentPath,
    selectedProfileId,
    selectedSuites,
    renderForm,
    alwaysShow,
    templatesPinned,
    openedTabs,
    currentUser,
    selectedDictionaries,
  }) => {
    const ref = React.createRef<HTMLDivElement>()
    const formRef = React.createRef<HTMLFormElement>()
    const inputCreateRef = useRef<HTMLInputElement>(null)

    const hideForm = () => {
      if (ref.current) ref.current.classList.remove('input')
      if (inputCreateRef.current) inputCreateRef.current.classList.remove('suite', 'dict')
      if (formRef.current) formRef.current.reset()
    }

    const submitForm = async (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      const input = ev.currentTarget.querySelector('input')
      if (client && input && !!input.value.replace(/\s/g, '').length) {
        if (input.classList.contains('suite')) {
          await client.mutate({
            mutation: SUITE_CREATE_MUTATION,
            variables: {
              params: {
                title: input.value,
                is_enabled: true,
                profile_id: selectedProfileId,
              },
            },
            refetchQueries: () => getSuitesRefetchData(selectedProfileId),
          })
          hideForm()
          notifyWithDelay({ msg: 'Набор успешно создан!', hideAfter: 2000 })
        } else if (input.classList.contains('dict')) {
          await client.mutate({
            mutation: DICTIONARY_CREATE_MUTATION,
            variables: {
              params: {
                code: input.value,
                description: '',
                content: '<div><br></div>',
                common: false,
                profile_ids: [selectedProfileId],
                meta: {
                  last_user: {
                    uuid: currentUser.get('uuid'),
                    name: currentUser.get('name') || '',
                    username: currentUser.get('username'),
                    user_role: currentUser.getIn(['role', 'type']),
                  },
                },
              },
            },
            refetchQueries: () => getDictsRefetchData(selectedProfileId),
          })
          hideForm()
          notifyWithDelay({ msg: 'Словарь успешно создан!', hideAfter: 2000 })
        }
      }
    }

    const handleAction: { [key: string]: () => void } = {
      removeSuites: () => {
        if (selectedSuites.size) {
          let ids = Set()
          selectedSuites.toList().map((item) => (ids = ids.add(item.get('id'))))
          setCustomConfirmConfig({
            active: true,
            activeName: 'removeSuites',
            title: `Удалить выбранны${ids.size > 1 ? 'е' : 'й'} набор${ids.size > 1 ? 'ы' : ''}`,
            onConfirm: async () => {
              if (client) {
                const { data } = await client.mutate({
                  mutation: SUITE_REMOVE_MUTATION,
                  variables: {
                    id: ids,
                  },
                  refetchQueries: () => getSuitesRefetchData(selectedProfileId),
                })
                const { suitesRemoveMutations } = data
                if (suitesRemoveMutations && suitesRemoveMutations.status) {
                  ids.forEach((suiteId: any) => {
                    if (openedTabs.getIn([selectedProfileId, suiteId])) {
                      if (openedTabs.get(selectedProfileId) && openedTabs.get(selectedProfileId).size > 1) {
                        if (openedTabs.get(selectedProfileId).last().get('id') !== suiteId) {
                          setActiveTab(openedTabs.get(selectedProfileId).last().get('id'))
                        } else if (openedTabs.get(selectedProfileId).first().get('id') !== suiteId) {
                          setActiveTab(openedTabs.get(selectedProfileId).first().get('id'))
                        } else {
                          setActiveTab(null)
                        }
                      } else {
                        setActiveTab(null)
                      }
                      closeOpenedTab(selectedProfileId, suiteId)
                    }
                    if (templatesPinned.get(suiteId)) setPinnedTemplates(suiteId, null, null)
                  })
                  notifyWithDelay({
                    msg: `${ids.size > 1 ? 'Наборы успешно удалены!' : 'Набор успешно удалён!'}`,
                    hideAfter: 2000,
                  })
                  setTimeout(() => selectUnselectSuites(null), 600)
                } else {
                  notifyWithDelay({
                    className: 'error',
                    msg: 'При удалении наборов произошла ошибка!',
                  })
                }
              }
            },
          })
        } else {
          setStatusBarNotification({ msg: 'Наборы не выбраны!', hideAfter: 2000 })
        }
      },
      pauseSuites: () => {
        if (selectedSuites.size) {
          setCustomConfirmConfig({
            active: true,
            activeName: 'pauseSuites',
            title: `Изменить статус набор${selectedSuites.size > 1 ? 'ов' : 'а'} на противоположный`,
            onConfirm: async () => {
              let updatedSuites = List()
              selectedSuites.forEach((suite) => {
                updatedSuites = updatedSuites.push({
                  id: suite.get('id'),
                  is_enabled: !suite.get('is_enabled'),
                })
              })
              if (client) {
                await client.mutate({
                  mutation: SUITE_MULTIPLE_UPDATE_MUTATION,
                  variables: { params: updatedSuites },
                  refetchQueries: () => getSuitesRefetchData(selectedProfileId),
                })
                notifyWithDelay({
                  msg: 'Статус успешно изменён!',
                  hideAfter: 2000,
                })
                setTimeout(() => selectUnselectSuites(null), 600)
              }
            },
          })
        } else {
          setStatusBarNotification({ msg: 'Наборы не выбраны!', hideAfter: 2000 })
        }
      },
      addSuite: () => {
        if (ref.current) ref.current.classList.add('input')
        if (inputCreateRef.current) {
          inputCreateRef.current.classList.add('suite')
          inputCreateRef.current.placeholder = 'Введите название набора'
          inputCreateRef.current.focus()
        }
      },
      removeDicts: () => {
        if (selectedDictionaries.size) {
          let ids = Set<string>()
          selectedDictionaries.toList().map((item) => (ids = ids.add(item.get('id'))))
          setCustomConfirmConfig({
            active: true,
            activeName: 'removeDicts',
            title: `Удалить выбранны${ids.size > 1 ? 'е' : 'й'} словар${ids.size > 1 ? 'и' : 'ь'}`,
            onConfirm: async () => {
              if (client) {
                const { data } = await client.mutate({
                  mutation: DICTIONARY_REMOVE_MUTATION,
                  variables: {
                    id: ids,
                  },
                  refetchQueries: () => getDictsRefetchData(selectedProfileId),
                })
                const { dictionariesRemoveMutations } = data
                if (dictionariesRemoveMutations && dictionariesRemoveMutations.status) {
                  closeDictionary(ids)
                  notifyWithDelay({
                    msg: `${ids.size > 1 ? 'Словари успешно удалены!' : 'Словарь успешно удалён!'}`,
                    hideAfter: 2000,
                  })
                  setTimeout(() => selectUnselectDictionaries(null), 600)
                } else {
                  notifyWithDelay({
                    className: 'error',
                    msg: 'При удалении словарей произошла ошибка!',
                  })
                }
              }
            },
          })
        } else {
          setStatusBarNotification({ msg: 'Словари не выбраны!', hideAfter: 2000 })
        }
      },
      pauseDicts: () => {
        if (selectedDictionaries.size) {
          setCustomConfirmConfig({
            active: true,
            activeName: 'pauseDicts',
            title: `Изменить статус словар${selectedDictionaries.size > 1 ? 'ей' : 'я'} на противоположный`,
            onConfirm: async () => {
              let updatedDicts = List()
              selectedDictionaries.forEach((dict) => {
                updatedDicts = updatedDicts.push({
                  id: dict.get('id'),
                  is_enabled: !dict.get('is_enabled'),
                  meta: {
                    last_user: {
                      uuid: currentUser.get('uuid'),
                      name: currentUser.get('name') || '',
                      username: currentUser.get('username'),
                      user_role: currentUser.getIn(['role', 'type']),
                    },
                  },
                })
              })
              if (client) {
                await client.mutate({
                  mutation: DICTIONARY_MULTIPLE_UPDATE_MUTATION,
                  variables: { params: updatedDicts },
                  refetchQueries: () => getDictsRefetchData(selectedProfileId),
                })
                notifyWithDelay({
                  msg: 'Статус успешно изменён!',
                  hideAfter: 2000,
                })
                setTimeout(() => selectUnselectDictionaries(null), 600)
              }
            },
          })
        } else {
          setStatusBarNotification({ msg: 'Словари не выбраны!', hideAfter: 2000 })
        }
      },
      addDict: () => {
        if (ref.current) ref.current.classList.add('input')
        if (inputCreateRef.current) {
          inputCreateRef.current.classList.add('dict')
          inputCreateRef.current.placeholder = 'Введите название словаря'
          inputCreateRef.current.focus()
        }
      },
    }

    if (currentPath === '/settings/profile/') return null

    return selectedProfileId || alwaysShow ? (
      <div className="toolbar-actions" ref={ref}>
        {renderForm && (
          <form autoComplete="off" className="toolbar-actions-form" ref={formRef} onSubmit={submitForm}>
            <input ref={inputCreateRef} type="text" name="title" />
            <button type="button" onClick={hideForm}>
              <Icon icon={['fas', 'ban']} props={{ size: 'sm' }} />
            </button>
            <button type="submit">
              <Icon icon={['far', 'save']} props={{ size: 'sm' }} />
            </button>
          </form>
        )}
        {config.map((el, index) => {
          return (
            <div key={index} className="toolbar-actions-btn-wrapper">
              <button
                className={`toolbar-actions-btn ${el.color || ''}`}
                title={el.title}
                onClick={handleAction[el.name]}
              >
                <Icon icon={el.icon} props={el.iconProps} />
              </button>
              {(
                el.name === 'pauseSuites' ||
                el.name === 'removeSuites' ||
                el.name === 'pauseDicts' ||
                el.name === 'removeDicts'
              ) && (
                <CustomConfirm
                  name={el.name}
                  style={{ left: 'calc(50% - 40px)', bottom: '33px' }}
                  theme="light"
                  isFrom="bottom"
                />
              )}
            </div>
          )
        })}
      </div>
    ) : null
  }
)

export const mapStateToProps = (state: ReduxState) => ({
  currentPath: state.router.location.pathname,
  selectedProfileId: state.profiles.get('selectedProfile').id,
  selectedSuites: state.editors.get('selectedSuites'),
  templatesPinned: state.toolbar.get('templatesPinned'),
  openedTabs: state.editors.get('openedTabs'),
  currentUser: state.auth.get('user'),
  selectedDictionaries: state.editors.get('selectedDictionaries'),
})

ToolbarActions.displayName = 'ToolbarActions'

export default connect(mapStateToProps)(withApollo<ToolbarActionsProps>(ToolbarActions))
