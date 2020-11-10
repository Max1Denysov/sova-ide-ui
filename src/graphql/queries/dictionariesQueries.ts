import gql from 'graphql-tag'

export const DICTIONARIES_QUERY = gql`
  query($profile_id: String!, $offset: Int, $limit: Int, $order: DictionariesOrderParams) {
    dictionariesQueries(config: { 
      id: 1, 
      params: { 
        profile_id: $profile_id, 
        offset: $offset, 
        limit: $limit,
        order: $order
      }, 
      method: "dictionary.list" 
    }) {
      items {
        id
        hidden
        code
        description
        is_enabled
        common
        updated
        profile_ids
        meta {
          last_user {
            uuid
            name
            username
            user_role
          }
        }
      }
    }
  }
`

export const DICTIONARY_FETCH_QUERY = gql`
  query($id: String!) {
    dictionariesQueries(config: { id: 1, params: { id: $id }, method: "dictionary.fetch" }) {
      item {
        id
        hidden
        code
        description
        content
        is_enabled
        common
        profile_ids
        updated
        meta {
          last_user {
            uuid
            name
            username
            user_role
          }
        }
        stats {
          last_used
          used_7d
          used_30d
        }
      }
    }
  }
`

export const DICTIONARY_CREATE_MUTATION = gql`
  mutation($params: DictionariesQueriesParams) {
    dictionariesMutations(config: { id: 1, params: $params, method: "dictionary.create"}) {
      status
      response {
        id
      }
    }
  }
`

export const DICTIONARY_REMOVE_MUTATION = gql`
  mutation($id: [String]) {
    dictionariesRemoveMutations(config: { id: 1, params: { id: $id }, method: "dictionary.remove" }) {
      status
    }
  }
`

export const DICTIONARY_UPDATE_MUTATION = gql`
  mutation($params: DictionariesQueriesParams) {
    dictionariesMutations(
      config: { id: 1, params: $params, method: "dictionary.update" }
    ) {
      status
    }
  }
`

export const DICTIONARY_MULTIPLE_UPDATE_MUTATION = gql`
  mutation($params: [DictionariesQueriesParams]) {
    dictionariesMultipleMutations(
      config: { id: 1, params: $params, method: "dictionary.update" }
    ) {
      status
    }
  }
`