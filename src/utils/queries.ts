import { SUITES_QUERY } from '../graphql/queries/suitesQuery'
import { TEMPLATES_QUERY } from '../graphql/queries/templatesQuery'
import { DICTIONARIES_QUERY } from '../graphql/queries/dictionariesQueries'
import { store } from '../store/store'
import { RandomObject } from '../@types/common'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { List, Map } from 'immutable'
import { ProfileItem } from '../components/menu/menuSelect/menuSelect'
import { PROFILE_QUERIES_GQL, PROFILE_QUERIES_GQL_SYS_ADMIN } from '../graphql/queries/profilesQueries'

interface RefetchItem {
  query: any
  variables: RandomObject
}

const getSuitesRefetchData = (selectedProfileId: string) => {
  const allSuitesLoaded = store.getState().toolbar.get('allSuitesLoaded')
  const suitesSorting = store.getState().toolbar.get('suitesSorting')
  const allItemsLoaded = selectedProfileId ? allSuitesLoaded.get(selectedProfileId) : false
  const sortType =
    typeof suitesSorting.get('sortType') === 'string'
      ? suitesSorting.get('sortType') === 'date'
        ? 'updated'
        : 'title'
      : 'title'
  const sortOrder = typeof suitesSorting.get('isAsc') === 'boolean' ? (suitesSorting.get('isAsc') ? 1 : -1) : 1

  return [
    {
      query: SUITES_QUERY,
      variables: {
        profile_ids: [selectedProfileId],
        limit: allItemsLoaded ? 50000 : 500,
        order: {
          field: sortType,
          order: sortOrder,
        },
      },
    },
  ] as RefetchItem[]
}

const getTemplatesRefetchData = (suiteId: string) => {
  return [{ query: TEMPLATES_QUERY, variables: { suite_id: suiteId } }] as RefetchItem[]
}

const getDictsRefetchData = (selectedProfileId?: string) => {
  const dictionariesSorting = store.getState().toolbar.get('dictionariesSorting')
  const allSortType =
    typeof dictionariesSorting.getIn(['all', 'sortType']) === 'string'
      ? dictionariesSorting.getIn(['all', 'sortType']) === 'title'
        ? 'code'
        : 'updated'
      : 'code'
  const allSortOrder =
    typeof dictionariesSorting.getIn(['all', 'isAsc']) === 'boolean'
      ? dictionariesSorting.getIn(['all', 'isAsc'])
        ? 1
        : -1
      : 1
  const privateSortType =
    typeof dictionariesSorting.getIn(['private', 'sortType']) === 'string'
      ? dictionariesSorting.getIn(['private', 'sortType']) === 'title'
        ? 'code'
        : 'updated'
      : 'code'
  const privateSortOrder =
    typeof dictionariesSorting.getIn(['private', 'isAsc']) === 'boolean'
      ? dictionariesSorting.getIn(['private', 'isAsc'])
        ? 1
        : -1
      : 1
  if (selectedProfileId) {
    return [
      {
        query: DICTIONARIES_QUERY,
        variables: {
          profile_id: '',
          limit: 50000,
          order: {
            field: allSortType,
            order: allSortOrder,
          },
        },
      },
      {
        query: DICTIONARIES_QUERY,
        variables: {
          profile_id: selectedProfileId,
          limit: 50000,
          order: {
            field: privateSortType,
            order: privateSortOrder,
          },
        },
      },
    ] as RefetchItem[]
  } else {
    return [
      {
        query: DICTIONARIES_QUERY,
        variables: {
          profile_id: '',
          limit: 50000,
          order: {
            field: allSortType,
            order: allSortOrder,
          },
        },
      },
    ] as RefetchItem[]
  }
}

const getProfilesListFromCache = (
  { client, currentUser, selectedAccount }: {
    client: ApolloClient<NormalizedCacheObject>,
    currentUser: Map<any, any>,
    selectedAccount: Map<any, any>
  },
  isDetailed?: boolean
) => {
  const isSysAdmin = currentUser.getIn(['role', 'type']) === 'sys_admin'
  let profiles = List()

  if (client) {
    try {
      const profilesCache: { profilesQueries: { items: ProfileItem[] } } | null = client.cache.readQuery({
        query: isSysAdmin ? PROFILE_QUERIES_GQL_SYS_ADMIN : PROFILE_QUERIES_GQL,
        variables: getProfilesConfig(currentUser, selectedAccount),
      })
      if (profilesCache && profilesCache.profilesQueries && profilesCache.profilesQueries.items) {
        if (isDetailed) {
          profiles = List(
            isSysAdmin
              ? profilesCache.profilesQueries.items
              : profilesCache.profilesQueries.items.filter((item: ProfileItem) => {
                return item.permissions && (item.permissions.dl_read || item.permissions.dl_write)
              })
          )
        } else {
          profilesCache.profilesQueries.items.forEach(item => {
            if (
              !profiles.includes(item.id) &&
              (isSysAdmin || (item.permissions && (item.permissions.dl_read || item.permissions.dl_write)))
            ) {
              profiles = profiles.push(item.id)
            }
          })
        }
      }
    } catch (e) {}
  }

  return profiles
}

const getProfilesConfig = (currentUser: Map<any, any>, selectedAccount: Map<any, any>) => {
  if (currentUser.getIn(['role', 'type']) === 'sys_admin') {
    return {
      user: {
        user_id: '',
      },
      account_id: '',
      full_list: true,
    }
  } else {
    return {
      user: {
        user_id: currentUser.get('uuid'),
      },
      account_id:
        selectedAccount.size && selectedAccount.get('account_id')
          ? selectedAccount.get('account_id')
          : currentUser.get('accounts') && currentUser.get('accounts').size
          ? currentUser.get('accounts').first().get('account_id')
          : '',
      full_list:
        currentUser.getIn(['role', 'type']) === 'acc_admin' || currentUser.getIn(['role', 'type']) === 'acc_moderator',
    }
  }
}

export { getSuitesRefetchData, getTemplatesRefetchData, getDictsRefetchData, getProfilesListFromCache, getProfilesConfig }
