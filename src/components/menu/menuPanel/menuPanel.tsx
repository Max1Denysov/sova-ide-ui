import React, { useEffect } from 'react'
import './menuPanel'
import MenuSelect from '../menuSelect/menuSelect'
import { Query, QueryResult, withApollo } from 'react-apollo'
import { PROFILE_QUERIES_GQL, PROFILE_QUERIES_GQL_SYS_ADMIN } from '../../../graphql/queries/profilesQueries'
import ApolloLoading from '../../common/apolloLoading'
import ApolloError from '../../common/apolloError'
import { ReduxState } from '../../../store/store'
import { connect } from 'react-redux'
import { Map, fromJS } from 'immutable'
import CustomSelect from '../../common/customSelect'
import {
  selectAccount,
  selectProfile,
  setAccountComplect,
  setCompilationDate,
} from '../../../store/dispatcher'
import ApolloClient from 'apollo-client'
import { getProfilesConfig } from '../../../utils/queries'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { COMPILATION_COMPLECT_QUERY } from '../../../graphql/queries/compilationQueries'

interface MenuPanelProps {
  client: ApolloClient<NormalizedCacheObject>
  rehydrated: boolean
  currentUser: Map<any, any>
  renderAccountsList: boolean
  selectedAccount: Map<any, any>
}

export const MenuPanel = React.memo<MenuPanelProps>(
  ({ rehydrated, currentUser, renderAccountsList, selectedAccount, client }) => {
    const isSysAdmin = currentUser.getIn(['role', 'type']) === 'sys_admin'

    const getAccountComplect = async (account_id: string) => {
      if (client) {
        const { data } = await client.query({
          query: COMPILATION_COMPLECT_QUERY,
          variables: {
            params: {
              account_id: account_id,
            },
          },
        })
        const { compilationComplectQuery } = data
        if (
          compilationComplectQuery &&
          compilationComplectQuery.response &&
          compilationComplectQuery.response.items &&
          compilationComplectQuery.response.items.length
        ) {
          setAccountComplect(Map(fromJS(compilationComplectQuery.response.items[0])))
        } else {
          setAccountComplect(Map())
          setCompilationDate(Map())
        }
      }
    }

    const handleAccountSelect = (account: Map<any, any>) => {
      selectAccount(account)
      getAccountComplect(account.get('account_id'))
      if (currentUser.getIn(['role', 'type']) !== 'sys_admin') selectProfile(null)
    }

    return (
      <div className="menu-panel">
        {renderAccountsList || !selectedAccount.size ? (
          <CustomSelect
            options={currentUser.get('accounts')}
            value={selectedAccount}
            onSelect={handleAccountSelect}
            defaultPlaceholder="Выберите аккаунт"
            itemsVisible={10}
          />
        ) : (
          <Query
            query={isSysAdmin ? PROFILE_QUERIES_GQL_SYS_ADMIN : PROFILE_QUERIES_GQL}
            variables={getProfilesConfig(currentUser, selectedAccount)}
          >
            {(result: QueryResult) => {
              if (!result) return null
              const { loading, error, data, refetch, networkStatus } = result
              useEffect(() => {
                rehydrated && refetch()
                // eslint-disable-next-line
              }, [rehydrated])
              if (loading && !data) return <ApolloLoading />
              if (error) return <ApolloError errorMsg={error.message} />

              let items = data && data.profilesQueries && data.profilesQueries.items ? data.profilesQueries.items : []

              if (networkStatus === 4) return <MenuSelect items={items} />
              return <MenuSelect items={items} />
            }}
          </Query>
        )}
      </div>
    )
  }
)

export const mapStateToProps = (state: ReduxState) => ({
  rehydrated: state._persist.rehydrated,
  currentUser: state.auth.get('user'),
  selectedAccount: state.profiles.get('selectedAccount'),
})

MenuPanel.displayName = 'MenuPanel'

export default connect(mapStateToProps)(withApollo<MenuPanelProps>(MenuPanel))
