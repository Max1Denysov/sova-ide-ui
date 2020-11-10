import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TEMPLATE_CREATE_MUTATION } from '../../../graphql/queries/templatesQuery'
import Icon from '../../common/icon'
import { ReduxState } from '../../../store/store'
import { Mutation } from 'react-apollo'
import { Map } from 'immutable'
import { ProfileItem } from '../../menu/menuSelect/menuSelect'
import { getSuitesRefetchData, getTemplatesRefetchData } from '../../../utils/queries'
import { notifyWithDelay } from '../../../utils/common'

interface EditorsCreateProps {
  activeTab: string
  selectedProfile: ProfileItem
  currentUser: Map<any, any>
  editorsSorting: Map<any, any>
}

interface EditorsCreateState {
  isActive: boolean
  title: string
}

export class EditorsCreate extends PureComponent<EditorsCreateProps, EditorsCreateState> {
  state = {
    isActive: false,
    title: '',
  }

  inputRef = React.createRef<HTMLInputElement>()
  mutateFunc = () => {}

  toggleInput = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
      title: ''
    }), () => {
        if (this.state.isActive && this.inputRef.current) this.inputRef.current.focus()
      }
    )
  }

  handleChange = (value: string) => this.setState(() => ({ title: value }))

  handleKeyPress = (key: string) => {
    if (
      key === 'Enter' &&
      typeof this.mutateFunc === 'function' &&
      !!this.state.title.replace(/\s/g, '').length
    ) {
      this.mutateFunc()
    }
  }

  clearInput = () => this.setState(() => ({
    title: ''
  }), () => this.inputRef.current && this.inputRef.current.focus())

  render() {
    const { activeTab, selectedProfile, currentUser, editorsSorting } = this.props
    const { isActive, title } = this.state
    const isByPosition = editorsSorting.get('type') === 'position'
    const isAsc = editorsSorting.get('isAsc')
    return (
      <div className="editors-add-template">
        {isActive ? (
          <>
            <div className="editors-add-input">
              <input
                ref={this.inputRef}
                type="text"
                id="new-template-title"
                value={title}
                placeholder="Введите название шаблона"
                onChange={({ currentTarget: { value } }) => this.handleChange(value)}
                onKeyPress={({ key }) => this.handleKeyPress(key)}
              />
              {!!title && (
                <button onClick={this.clearInput}>
                  <Icon icon={['fas', 'times']} props={{ size: 'xs' }} />
                </button>
              )}
            </div>
            <button onClick={this.toggleInput} className="editors-add-new" title="Отменить создание">
              <Icon icon={['fas', 'ban']} />
            </button>
            <Mutation
              mutation={TEMPLATE_CREATE_MUTATION}
              variables={{
                params: {
                  suite_id: activeTab,
                  content: '<div><br></div>',
                  position_before: isByPosition && isAsc ? 'first' : null,
                  meta: {
                    title: title,
                    description: '',
                    last_user: {
                      uuid: currentUser.get('uuid'),
                      name: currentUser.get('name') || '',
                      username: currentUser.get('username'),
                      user_role: currentUser.getIn(['role', 'type']),
                    },
                  }
                }
              }}
              refetchQueries={() => getSuitesRefetchData(selectedProfile.id).concat(getTemplatesRefetchData(activeTab))}
              onCompleted={() => {
                this.toggleInput()
                notifyWithDelay({ msg: 'Шаблон успешно создан!', hideAfter: 2000 })
              }}
            >
              {(postMutation: () => void) => {
                this.mutateFunc = postMutation
                return (
                  <button
                    className="editors-add-new"
                    title="Создать шаблон"
                    onClick={() => !!title.replace(/\s/g, '').length && postMutation()}
                  >
                    <Icon icon={['far', 'save']} />
                  </button>
                )
              }}
            </Mutation>
          </>
        ) : (
          <button onClick={this.toggleInput} className="editors-add-new add-toggle" title="Создать шаблон">
            <Icon icon={['fas', 'plus']} />
          </button>
        )}
      </div>
    )
  }
}

export const mapStateToProps = (state: ReduxState) => ({
  selectedProfile: state.profiles.get('selectedProfile'),
  activeTab: state.editors.get('activeTab'),
  currentUser: state.auth.get('user'),
  editorsSorting: state.editors.get('editorsSorting'),
})

export default connect(mapStateToProps)(EditorsCreate)
