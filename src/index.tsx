import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import './styles/index.css'
import App from './App'
import apolloClient, { persistApolloCache } from './graphql/apolloClient'
import ApolloLoading from './components/common/apolloLoading'

class ApolloPersist extends PureComponent {
  state = { loaded: false }

  async componentDidMount() {
    try {
      await persistApolloCache
    } catch (error) {
      console.error('Error restoring Apollo cache', error)
    }

    this.setState(() => ({
      loaded: true,
    }))
  }

  render() {
    const { loaded } = this.state
    if (!loaded) return <ApolloLoading />
    return <ApolloProvider client={apolloClient}>{this.props.children}</ApolloProvider>
  }
}

ReactDOM.render(
  <ApolloPersist>
    <App />
  </ApolloPersist>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
/* serviceWorker.register()
 */
