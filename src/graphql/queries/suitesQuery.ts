import gql from 'graphql-tag'

export const SUITES_QUERY = gql`
  query($profile_ids: [String!], $offset: Int, $limit: Int) {
    suitesQueries(
      config: { id: 1, params: { profile_ids: $profile_ids, offset: $offset, limit: $limit }, method: "suite.list" }
    ) {
      items {
        id
        title
        profile_id
        is_enabled
        updated
        stat {
          templates
        }
        hidden
      }
    }
  }
`

export const SUITE_CREATE_MUTATION = gql`
  mutation($params: SuitesQueriesParams) {
    suitesMutations(
      config: { id: 1, params: $params, method: "suite.create" }
    ) {
      status
    }
  }
`

export const SUITE_REMOVE_MUTATION = gql`
  mutation($id: [String]) {
    suitesRemoveMutations(config: { id: 1, params: { id: $id }, method: "suite.remove" }) {
      status
    }
  }
`

export const SUITE_UPDATE_MUTATION = gql`
  mutation($params: SuitesQueriesParams) {
    suitesMutations(config: { id: 1, params: $params, method: "suite.update" }) {
      status
    }
  }
`

export const SUITE_MULTIPLE_UPDATE_MUTATION = gql`
  mutation($params: [SuitesQueriesParams]) {
    suitesMultipleMutations(config: { id: 1, params: $params, method: "suite.update" }) {
      status
    }
  }
`