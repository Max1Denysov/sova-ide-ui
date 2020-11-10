import gql from 'graphql-tag'

export const TEMPLATES_QUERY = gql`
  query($id: [String], $suite_id: String) {
    templatesQueries(
      config: { id: 1, params: { offset: 0, limit: 1000, id: $id, suite_id: $suite_id }, method: "template.list" }
    ) {
      items {
        id
        hidden
        position
        content
        created
        updated
        is_enabled
        profile_id
        suite_id
        suite_title
        meta {
          title
          description
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

export const TEMPLATE_CREATE_MUTATION = gql`
  mutation($params: TemplatesMutationsParams) {
    templatesMutations(config: { id: 1, params: $params, method: "template.create" }) {
      status
      response {
        id
        hidden
        position
        content
        created
        updated
        is_enabled
        meta {
          title
          description
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

export const TEMPLATE_REMOVE_MUTATION = gql`
  mutation($id: String!) {
    templatesMutations(
      config: { id: 1, params: { id: $id }, method: "template.remove" }
    ) {
      status
    }
  }
`

export const TEMPLATE_UPDATE_MUTATION = gql`
  mutation($params: TemplatesMutationsParams) {
    templatesMutations(config: {id: 1, params: $params, method: "template.update"}) {
      status
    }
  }
`

export const TEMPLATE_MULTIPLE_UPDATE_MUTATION = gql`
  mutation($params: [TemplatesMutationsParams]) {
    templatesMultipleMutations(config: {id: 1, params: $params, method: "template.update"}) {
      status
    }
  }
`