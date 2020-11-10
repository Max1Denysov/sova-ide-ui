import React from 'react'
import DictionariesItem from './dictionariesItem/dictionariesItem'
import { connect } from 'react-redux'
import { ReduxState } from '../../store/store'
import { Map } from 'immutable'
import ScrollbarCustom from '../common/customScrollbar'
import ErrorBoundary from '../errorBoundary/errorBoundary'
import WorkareaEmpty from '../workarea/workareaEmpty/workareaEmpty'

interface DictionariesProps {
  rehydrated: boolean
  openedDictionaries: Map<any, any>
  currentUser: Map<any, any>
  selectedProfileId: string
  openedTabs: Map<any, any>
  showLinesCount: boolean
  selectedAccount: Map<any, any>
}

export const Dictionaries = React.memo<DictionariesProps>(
  ({
     openedDictionaries,
     currentUser,
     selectedProfileId,
     openedTabs,
     showLinesCount,
     selectedAccount,
     rehydrated
  }) => {
    if (!openedDictionaries.size) {
      return <WorkareaEmpty>Выберите<br/>словарь</WorkareaEmpty>
    }
    return (
      <ScrollbarCustom className="dictionaries">
        <div className="dict-list">
          {openedDictionaries.toList()
            .sort((a: Map<any, any>, b: Map<any, any>) => (
              b.get('opened') !== a.get('opened')
                ? (b.get('opened') < a.get('opened') ? -1 : 1)
                : b.get('id') < a.get('id') ? -1 : 1
            ))
            .map(dict => (
              <ErrorBoundary componentWithError="DictionariesItemWithError" key={dict.get('id')}>
                <DictionariesItem
                  rehydrated={rehydrated}
                  currentUser={currentUser}
                  dictId={dict.get('id')}
                  key={dict.get('id')}
                  selectedProfileId={selectedProfileId}
                  openedTabs={openedTabs}
                  showLinesCount={showLinesCount}
                  selectedAccount={selectedAccount}
                />
              </ErrorBoundary>
          ))}
        </div>
      </ScrollbarCustom>
    )
  }
)

Dictionaries.displayName = 'Dictionaries'

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  openedDictionaries: state.editors.get('openedDictionaries'),
  currentUser: state.auth.get('user'),
  selectedProfileId: state.profiles.get('selectedProfile').id,
  openedTabs: state.editors.get('openedTabs'),
  showLinesCount: state.settings.getIn([
    'userSettings',
    'common',
    'visual',
    'clientSettings',
    'showLinesCount',
    'value',
  ]),
  selectedAccount: state.profiles.get('selectedAccount'),
})

export default connect(mapStateToProps)(Dictionaries)
