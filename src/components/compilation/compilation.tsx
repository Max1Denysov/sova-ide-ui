import React, { PureComponent } from 'react'
import { COMPILATION_LIST_QUERY } from '../../graphql/queries/compilationQueries'
import ApolloLoading from '../common/apolloLoading'
import ApolloError from '../common/apolloError'
import { Query, QueryResult } from 'react-apollo'
import CompilationTasks from './compilationTasks/compilationTasks'
import { ReduxState } from '../../store/store'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import WorkareaEmpty from '../workarea/workareaEmpty/workareaEmpty'

export interface CompilationMessageItem {
  type: string
  status: string
  message: string
  near_text: string
  profile_id: string
  suite_id: string
  template_id: string
  template_meta: {
    title: string | null
    description: string | null
    last_user: {
      name: string
      uuid: string
      username: string
      user_role: string
    } | null
  } | null
}

export interface CompilationTaskItem {
  task_id: string
  status: string
  success: boolean | null
  created: number
  updated: number
  errortext?: string
  result?: {
    output: string
    messages: CompilationMessageItem[]
    complect_revision_id: string
    complect_revision_code: string
  }
  extra?: {
    complect_id: string
    complect_revision_id: string
  }
}

interface CompilationProps {
  rehydrated: boolean
  lastCompilationDate: Map<any, any>
  selectedAccount: Map<any, any>
  selectedAccountComplect: Map<any, any>
}

export class Compilation extends PureComponent<CompilationProps> {
  refetchQuery = () => {}

  componentDidMount() {
    if (this.props.rehydrated) this.refetchQuery()
  }

  componentDidUpdate(prevProps: Readonly<CompilationProps>) {
    if (prevProps.rehydrated !== this.props.rehydrated && this.props.rehydrated) {
      this.refetchQuery()
    }
  }

  render() {
    const { selectedAccount, selectedAccountComplect } = this.props

    if (!selectedAccount.size) {
      return <WorkareaEmpty>Выберите<br/>аккаунт</WorkareaEmpty>
    }
    if (!selectedAccountComplect.get('id')) {
      return <WorkareaEmpty>Комплект<br/>не найден</WorkareaEmpty>
    }

    return (
      <section className="compilation">
        <Query
          query={COMPILATION_LIST_QUERY}
          variables={{
            extra: {
              complect_id: selectedAccountComplect.get('id'),
            },
            limit: 250,
            order: {
              field: 'created',
              order: -1,
            },
            silent: true,
          }}
          pollInterval={30000}
        >
          {(result: QueryResult) => {
            if (!result) return null
            const { loading, error, data, networkStatus, refetch } = result
            try {
              this.refetchQuery = refetch
            } catch (e) {}
            if (loading && !data) return <ApolloLoading/>
            if (error) return <ApolloError errorMsg={error.message} />

            const tasks: CompilationTaskItem[] =
              data.compilationListQuery && data.compilationListQuery.response && data.compilationListQuery.response.items
                ? data.compilationListQuery.response.items.sort((a: CompilationTaskItem, b: CompilationTaskItem) => {
                  return b.created !== a.created ? (b.created < a.created ? -1 : 1) : 0
                })
                : []

            if (!tasks.length) {
              return <WorkareaEmpty>Запустите<br/>компиляцию</WorkareaEmpty>
            }

            if (networkStatus === 4) return <CompilationTasks tasks={tasks} refetchFunc={refetch} />
            return <CompilationTasks tasks={tasks} refetchFunc={refetch} />
          }}
        </Query>
      </section>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  lastCompilationDate: state.editors.get('lastCompilationDate'),
  selectedAccount: state.profiles.get('selectedAccount'),
  selectedAccountComplect: state.profiles.get('selectedAccountComplect'),
})

export default connect(mapStateToProps)(Compilation)