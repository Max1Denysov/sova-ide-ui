import React from 'react'

interface ApolloError {
  errorMsg?: string
}

const ApolloError = React.memo<ApolloError>(({ errorMsg }) => <div>{errorMsg}</div>)

export default ApolloError
