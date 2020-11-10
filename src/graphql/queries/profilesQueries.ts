import gql from 'graphql-tag'

export const PROFILE_QUERIES_GQL = gql`
  query($user: User!, $account_id: String!, $full_list: Boolean) {
    profilesQueries(
      config: {
        id: 1
        params: { user: $user, account_id: $account_id, full_list: $full_list, offset: 0, limit: 250 }
        method: "profile.list"
      }
    ) {
      items {
        id
        name
        is_enabled
        permissions {
          dl_read
          dl_write
          dict_read
          dict_write
        }
      }
    }
  }
`

export const PROFILE_QUERIES_GQL_SYS_ADMIN = gql`
  query($user: User!, $account_id: String, $full_list: Boolean) {
    profilesQueries(
      config: {
        id: 1
        params: { user: $user, account_id: $account_id, full_list: $full_list, offset: 0, limit: 250 }
        method: "profile.list"
      }
    ) {
      items {
        id
        name
        is_enabled
        permissions {
          dl_read
          dl_write
          dict_read
          dict_write
        }
      }
    }
  }
`

export const PROFILE_CREATE_MUTATION = gql`
  mutation($name: String!) {
    profilesMutations(
      config: {
        id: 1
        params: { id: null, name: $name, code: "", is_enabled: true, common: false }
        method: "profile.store"
      }
    ) {
      status
      response {
        id
        is_enabled
        name
        permissions {
          dl_read
          dl_write
          dict_read
          dict_write
        }
      }
    }
  }
`
