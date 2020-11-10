import React, { useEffect } from 'react'
import Icon from '../../common/icon'
import { connect } from 'react-redux'
import { ReduxState } from '../../../store/store'
import { COMPILATION_LIST_QUERY } from '../../../graphql/queries/compilationQueries'
import { QueryResult, Query } from 'react-apollo'
import { List } from 'immutable'
import { setCompilationDate } from '../../../store/dispatcher'
import { getDate, notifyWithDelay } from '../../../utils/common'
import { CompilationTaskItem } from '../../compilation/compilation'
import { Map } from 'immutable'
import { RandomObject } from '../../../@types/common'

interface MenuCompilationInfoProps {
  rehydrated: boolean
  lastCompilationDate: Map<any, any>
  selectedAccountComplect: Map<any, any>
}

export const MenuCompilationInfo = React.memo<MenuCompilationInfoProps>(
  ({ rehydrated, lastCompilationDate, selectedAccountComplect }) => {
    return !!selectedAccountComplect.get('id') ? (
      <div className="menu-compilation-info">
        <div className="menu-compilation-wrapper">
          {!!lastCompilationDate.get('date') && (
            <>
              <Icon icon={['fas', 'warehouse']} />
              <span className="menu-compilation-title">Последняя успешная компиляция:</span>
              <b className="menu-compilation-title">{lastCompilationDate.get('uuid')}</b>
              <span className="menu-compilation-text">({lastCompilationDate.get('date')})</span>
            </>
          )}
          <Query
            query={COMPILATION_LIST_QUERY}
            variables={{
              extra: {
                complect_id: selectedAccountComplect.get('id'),
              },
              limit: 100,
              order: {
                field: 'created',
                order: -1,
              },
              silent: true,
            }}
            pollInterval={30000}
            notifyOnNetworkStatusChange={true}
            fetchPolicy="network-only"
            onCompleted={(data: { compilationListQuery: RandomObject }) => {
              const tasks: CompilationTaskItem[] =
                data.compilationListQuery && data.compilationListQuery.response && data.compilationListQuery.response.items
                  ? data.compilationListQuery.response.items.sort((a: CompilationTaskItem, b: CompilationTaskItem) => {
                    return b.created !== a.created ? (b.created < a.created ? -1 : 1) : 0
                  })
                  : []
              if (tasks.length) {
                const tasksList = List(tasks)
                tasksList.forEach((task) => {
                  if (task && task.success) {
                    if (lastCompilationDate.get('date') !== getDate(task.updated, true)) {
                      setCompilationDate(
                        Map({
                          uuid: task.task_id,
                          date: getDate(task.updated || task.created, true),
                        })
                      )
                      notifyWithDelay({
                        msg: 'Данные об успешной компиляции обновлены!',
                        hideAfter: 2000,
                      })
                    }
                    return false
                  }
                })
              }
            }}
          >
            {(result: QueryResult) => {
              if (!result) return null
              const { refetch } = result
              useEffect(() => {
                rehydrated && refetch()
                // eslint-disable-next-line
              }, [rehydrated])
              return (
                <button className="menu-compilation-reload" onClick={() => refetch()} title="Обновить информацию">
                  <Icon icon={['fas', 'redo-alt']} />
                </button>
              )
            }}
          </Query>
        </div>
      </div>
    ) : null
  }
)

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  lastCompilationDate: state.editors.get('lastCompilationDate'),
  selectedAccountComplect: state.profiles.get('selectedAccountComplect'),
})

export default connect(mapStateToProps)(MenuCompilationInfo)
