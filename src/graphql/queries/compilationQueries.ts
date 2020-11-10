import gql from 'graphql-tag'

export const COMPILATION_CREATE_MUTATION = gql`
  mutation($params: CompilationParams) {
    compilationCreateMutation(
      config: { method: "compiler.create", params: $params }
    ) {
      status
      response {
        task_id
        status
        success
        created
        updated
      }
    }
  }
`

export const COMPILATION_LIST_QUERY = gql`
  query($limit: Int, $order: CompilationOrderParams, $extra: CompilationExtraParams) {
    compilationListQuery(
      config: { method: "compiler.list", params: { offset: 0, limit: $limit, order: $order, extra: $extra } }
    ) {
      status
      response {
        items {
          task_id
          status
          success
          created
          updated
          extra {
            complect_id
            complect_revision_id
          }
        }
      }
    }
  }
`

export const COMPILATION_TASK_QUERY = gql`
  query($task_id: String) {
    compilationTaskQuery(
      config: { method: "compiler.info", params: { task_id: $task_id } }
    ) {
      status
      response {
        task_id
        status
        success
        created
        updated
        errortext
        result {
          output
          messages {
            type
            status
            message
            near_text
            profile_id
            suite_id
            template_id
            template_meta {
              title
              description
              last_user {
                name
                uuid
                username
                user_role
              }
            }
          }
          complect_revision_id
          complect_revision_code
        }
      }
    }
  }
`

export const COMPILATION_COMPLECT_QUERY = gql`
  query($params: CompilationComplectParams) {
    compilationComplectQuery(
      config: { method: "complect.list", params: $params }
    ) {
      status
      response {
        items {
          id
          name
          code
          state
          profile_ids
          updated
          is_enabled
          compiler_target
        }
      }
    }
  }
`

export const COMPILATION_DEPLOY_LIST_QUERY = gql`
  query($limit: Int, $order: CompilationOrderParams, $extra: CompilationExtraParams) {
    compilationDeployListQuery(
      config: { method: "deploy.list", params: { offset: 0, limit: $limit, order: $order, extra: $extra } }
    ) {
      status
      response {
        items {
          task_id
          status
          success
          created
          updated
          extra {
            complect_id
            complect_revision_id
          }
        }
      }
    }
  }
`

export const COMPILATION_DEPLOY_RUN = gql`
  mutation($params: CompilationParams) {
    compilationDeployMutation(
      config: { method: "deploy.run", params: $params }
    ) {
      status
      response {
        task_id
        status
        meta {
          complect_revision_id
        }
        created
        updated
      }
    }
  }
`