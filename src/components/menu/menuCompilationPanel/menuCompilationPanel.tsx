import React from 'react'
import { COMPILATION_CREATE_MUTATION, COMPILATION_LIST_QUERY } from '../../../graphql/queries/compilationQueries'
import { Mutation } from 'react-apollo'
import { setCustomConfirmConfig } from '../../../store/dispatcher'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import { CompilationTaskItem } from '../../compilation/compilation'
import { notifyWithDelay } from '../../../utils/common'
import { Map } from 'immutable'
import CustomConfirm from '../../common/customConfirm'

interface CompilationCreateResult {
  status: boolean
  response: CompilationTaskItem
}

interface MenuCompilationPanelProps {
  selectedAccountComplect: Map<any, any>
}

export const MenuCompilationPanel = React.memo<MenuCompilationPanelProps>(
  ({ selectedAccountComplect }) => {
    const runCompilation = (mutate: () => void) => {
      setCustomConfirmConfig({
        active: true,
        activeName: 'confirm-menu-compilation',
        onConfirm: mutate,
        title: 'Запустить компиляцию',
      })
    }

    return !!selectedAccountComplect.get('id') ? (
      <div className="menu-compilation-panel">
        <Mutation
          mutation={COMPILATION_CREATE_MUTATION}
          variables={{
            params: {
              complect_id: selectedAccountComplect.get('id'),
              try_create_revision: true,
            },
          }}
          onCompleted={(data: { compilationCreateMutation: CompilationCreateResult }) => {
            if (data && data.compilationCreateMutation && data.compilationCreateMutation.status) {
              notifyWithDelay({
                msg: 'Задача по компиляции успешно создана!',
                hideAfter: 2000,
              })
            }
          }}
          refetchQueries={() => [
            {
              query: COMPILATION_LIST_QUERY,
              variables: {
                extra: {
                  complect_id: selectedAccountComplect.get('id'),
                },
                limit: 250,
                order: {
                  field: 'created',
                  order: -1,
                },
                silent: true,
              },
            },
          ]}
        >
          {(mutate: () => void) => {
            return (
              <>
                <button className="menu-compilation-btn" onClick={() => runCompilation(mutate)}>
                  Запустить компиляцию
                </button>
                <CustomConfirm
                  name="confirm-menu-compilation"
                  style={{ right: '85px', top: '70px' }}
                  theme="light"
                  isFrom="top"
                />
              </>
            )
          }}
        </Mutation>
      </div>
    ) : null
  }
)

export const mapStateToProps = (state: ReduxState) => ({
  selectedAccountComplect: state.profiles.get('selectedAccountComplect'),
})

export default connect(mapStateToProps)(MenuCompilationPanel)
