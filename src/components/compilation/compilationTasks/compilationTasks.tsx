import React from 'react'
import ScrollbarCustom from '../../common/customScrollbar'
import CompilationTask from '../compilationTask/compilationTask'
import { CompilationTaskItem } from '../compilation'

interface CompilationTasksProps {
  tasks: CompilationTaskItem[]
  refetchFunc: () => void
}

const CompilationTasks = React.memo<CompilationTasksProps>(({ tasks, refetchFunc }) => {
  return (
    <>
      <div className="compilation-tasks-title">Версии компиляции</div>
      <ScrollbarCustom className="compilation-tasks-wrapper">
        <ul className="compilation-tasks">
          {tasks.map(task => <CompilationTask key={task.task_id} task={task} refetchFunc={refetchFunc} />)}
        </ul>
      </ScrollbarCustom>
    </>
  )
})

export default CompilationTasks