import React, { PureComponent } from 'react'
import { getDate } from '../../../utils/common'
import { COMPILATION_TASK_QUERY } from '../../../graphql/queries/compilationQueries'
import ApolloLoading from '../../common/apolloLoading'
import ApolloError from '../../common/apolloError'
import { Query, QueryResult } from 'react-apollo'
import { compilationPatterns, formatText } from '../../editor/basicEditor/text'
import Icon from '../../common/icon'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import ScrollbarCustom from '../../common/customScrollbar'
import CompilationMessage from '../compilationMessage/compilationMessage'
import { CompilationMessageItem, CompilationTaskItem } from '../compilation'
import { setCustomConfirmConfig } from '../../../store/dispatcher'
import { Map } from 'immutable'

interface CompilationTaskProps {
  task: CompilationTaskItem
  refetchFunc: () => void
  animationEnabled: boolean
  lastCompilationDate: Map<any, any>
}

interface CompilationTaskState {
  isOpened: boolean
  allMessagesOpened: boolean
}

export class CompilationTask extends PureComponent<CompilationTaskProps, CompilationTaskState> {
  state = {
    isOpened: false,
    allMessagesOpened: false,
  }

  task = React.createRef<HTMLLIElement>()

  refetchQuery = () => {}

  triggerRefetch = () => {
    try {
      this.refetchQuery()
      setTimeout(this.props.refetchFunc, 100)
    } catch (e) {}
  }

  toggleMessagesOpenStatus = () => this.setState((prevState) => ({ allMessagesOpened: !prevState.allMessagesOpened }))

  scrollToOpened = () => {
    window.dispatchEvent(new Event('resize'))
    if (this.task.current && this.state.isOpened) {
      this.task.current.scrollIntoView({ behavior: this.props.animationEnabled ? 'smooth' : 'auto' })
    }
  }

  handleOpen = () => this.setState((prevState) => ({ isOpened: !prevState.isOpened }))

  deployRevision = (mutation: () => void) => {
    setCustomConfirmConfig({
      active: true,
      activeName: `confirm-task-${this.props.task.task_id}`,
      title: 'Провести релиз версии',
      onConfirm: mutation,
    })
  }

  componentDidUpdate(prevProps: Readonly<CompilationTaskProps>, prevState: Readonly<CompilationTaskState>) {
    if (prevProps.task !== this.props.task && typeof this.props.refetchFunc === 'function') {
      this.triggerRefetch()
    }

    if (prevState.isOpened !== this.state.isOpened && this.state.isOpened) {
      this.props.refetchFunc()
    }
  }

  render() {
    const { task } = this.props
    const { isOpened, allMessagesOpened } = this.state
    const className =
      task.status === 'finished'
        ? typeof task.success === 'boolean'
          ? task.success
            ? 'success'
            : 'failed'
          : 'null'
        : task.status
    const title =
      task.status === 'finished'
        ? typeof task.success === 'boolean'
          ? task.success
            ? 'Finished with success'
            : 'Finished with fail'
          : 'Finished with undefined result'
        : ''
    return (
      <li
        key={task.task_id}
        className={`compilation-tasks-item ${className}`}
        ref={this.task}
      >
        <div className="compilation-tasks-header" data-id={task.task_id}>
          <div className="compilation-tasks-toggle" onClick={this.handleOpen}>
            <div className="compilation-tasks-status" title={title}>
              {task.status}
            </div>
            <div className="compilation-tasks-info">
              Дата создания: <b>{getDate(task.updated || task.created, true)}</b>
              {' '}
              / ID: <b>{task.task_id}</b>
            </div>
          </div>
          {isOpened && (
            <button
              className="compilation-tasks-btn btn-refetch"
              title="Обновить детальную информацию"
              onClick={this.triggerRefetch}
            >
              <Icon icon={['fas', 'exchange-alt']} />
            </button>
          )}
        </div>
        {isOpened && (
          <Query query={COMPILATION_TASK_QUERY} variables={{ task_id: task.task_id }} onCompleted={this.scrollToOpened}>
            {(result: QueryResult) => {
              if (!result) return null
              const { loading, error, data, networkStatus, refetch } = result
              try {
                this.refetchQuery = refetch
              } catch (e) {}
              if (loading) return <ApolloLoading />
              if (error) return <ApolloError errorMsg={error.message} />

              const output =
                data &&
                data.compilationTaskQuery &&
                data.compilationTaskQuery.response &&
                data.compilationTaskQuery.response.result &&
                data.compilationTaskQuery.response.result.output
                  ? data.compilationTaskQuery.response.result.output
                  : ''
              const messages =
                data &&
                data.compilationTaskQuery &&
                data.compilationTaskQuery.response &&
                data.compilationTaskQuery.response.result &&
                data.compilationTaskQuery.response.result.messages
                  ? data.compilationTaskQuery.response.result.messages
                  : ''
              const errortext =
                data &&
                data.compilationTaskQuery &&
                data.compilationTaskQuery.response &&
                data.compilationTaskQuery.response.errortext
                  ? data.compilationTaskQuery.response.errortext
                  : ''

              const renderOutput = (output: string, messages: CompilationMessageItem[], errortext: string) => {
                const formattedText = formatText(output || errortext || 'Данные отсутствуют!', compilationPatterns)
                return (
                  <div className="compilation-tasks-inner">
                    {!!messages.length && (
                      <div className="compilation-tasks-messages">
                        <div className="compilation-messages-title">
                          Проблемы компиляции:
                          <button
                            className="compilation-messages-expand"
                            onClick={this.toggleMessagesOpenStatus}
                            title={`${allMessagesOpened ? 'Свернуть' : 'Развернуть'} все сообщения`}
                          >
                            <Icon icon={['fas', allMessagesOpened ? 'compress' : 'expand']} />
                          </button>
                        </div>
                        <ScrollbarCustom className="compilation-messages-wrapper">
                          <ul className="compilation-messages-list">
                            {messages.map((item, index) => (
                              <CompilationMessage key={index} item={item} allMessagesOpened={allMessagesOpened} />
                            ))}
                          </ul>
                        </ScrollbarCustom>
                      </div>
                    )}
                    <div className="compilation-tasks-details">
                      <p className="task-ids">
                        ID задачи: <b>{task.task_id}</b> ({getDate(task.updated || task.created, true)})
                      </p>
                      {formattedText
                        .split('\n')
                        .map(
                          (item, i) =>
                            item && (
                              <p
                                key={i}
                                className={
                                  item.includes('InfCompiler') || item.includes('Traceback') ? 'task-title' : ''
                                }
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            )
                        )}
                    </div>
                  </div>
                )
              }

              if (networkStatus === 4) return renderOutput(output, messages, errortext)
              return renderOutput(output, messages, errortext)
            }}
          </Query>
        )}
      </li>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  animationEnabled: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'animationEnabled',
    'value',
  ]),
  lastCompilationDate: state.editors.get('lastCompilationDate'),
})

export default connect(mapStateToProps)(CompilationTask)
