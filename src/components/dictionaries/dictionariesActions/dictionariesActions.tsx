import React from 'react'
import { Mutation } from 'react-apollo'
import Icon from '../../common/icon'
import { PureQueryOptions } from 'apollo-client'
import EditorsUpdates from '../../editor/editorsUpdates/editorsUpdates'
import { dictActions } from '../../../routes/configs/dictionariesConfig'
import CustomConfirm from '../../common/customConfirm'

interface DictionariesActionsProps {
  forwardedRef: React.RefObject<HTMLButtonElement>
  saved: boolean
  selectMutation(
    action: string
  ):
    | {
        mutation: any
        vars?: {}
        refetch?: PureQueryOptions[]
        callback?: (id: string | null) => void
        removeAsk?: () => void
      }
    | false
  handleAction(action: string, mutation?: () => void): void
  lastUpdated: number
  lastUser: {
    uuid: string
    name: string
    username: string
    user_role: string
  } | null
}

const DictionariesActions = React.memo<DictionariesActionsProps>(
  ({ forwardedRef, saved, selectMutation, handleAction, lastUpdated, lastUser }) => {
    return (
      <div className="editorTools">
        <div className="editorActions">
          {dictActions.map((el, index) => {
            if ((el.name === 'discard' || el.name === 'save') && saved) return null
            const data = selectMutation(el.name)
            const ref = el.name === 'save' ? forwardedRef : null
            return (
              <div
                key={`${el.name}-${lastUpdated}`}
                className="editorActionsBtnWrapper"
              >
                {data ? (
                  <Mutation
                    mutation={data.mutation}
                    variables={data.vars || {}}
                    refetchQueries={() => data.refetch || []}
                    onCompleted={({ dictionariesMutations }: { dictionariesMutations: { response: { id: string } } }) => {
                      const id = dictionariesMutations.response ? dictionariesMutations.response.id : null
                      return data.callback ? data.callback(id) : null
                    }}
                  >
                    {(postMutation: () => void) => (
                      <button
                        ref={ref}
                        className={`editorActionsBtn ${el.name}`}
                        onClick={() => handleAction(el.name, postMutation)}
                        title={el.title}
                      >
                        <Icon icon={el.icon} props={{ size: 'lg' }} />
                      </button>
                    )}
                  </Mutation>
                ) : (
                  <button
                    className={`editorActionsBtn ${el.name}`}
                    onClick={() => handleAction(el.name)}
                    title={el.title}
                  >
                    <Icon icon={el.icon} props={{ size: 'lg' }} />
                  </button>
                )}
                <CustomConfirm
                  name={`confirm-${el.name}-${lastUpdated}`}
                  style={{ left: 'calc(50% - 40px)', bottom: '40px' }}
                  theme="dark"
                  isFrom="bottom"
                />
              </div>
            )
          })}
          <EditorsUpdates lastUpdated={lastUpdated} lastUser={lastUser} />
        </div>
      </div>
    )
  }
)

export default DictionariesActions
