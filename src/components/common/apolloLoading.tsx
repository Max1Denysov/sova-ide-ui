import React from 'react'

const ApolloLoading = React.memo(() => (
  <div className="dot-loader">
    <div className="dot warning"></div>
    <div className="dot attention"></div>
    <div className="dot ok"></div>
  </div>
))

export default ApolloLoading
