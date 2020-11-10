import React, { PureComponent, useState } from 'react'
import { Map, fromJS } from 'immutable'
import logoFooter from '../../assets/images/logo.svg'
import basicAuth from '../../auth'
import {
  saveUserInfo,
  loadClientSettings,
  selectAccount,
  setAccountComplect,
  setCompilationDate,
} from '../../store/dispatcher'
import Icon from '../../components/common/icon'
import { HomeRoutePreload, NotFoundRoutePreload } from '..'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import { COMPILATION_COMPLECT_QUERY } from '../../graphql/queries/compilationQueries'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

const socialLinksConfig: { link: string; icon: [IconPrefix, IconName] }[] = [
  {
    link: 'https://vk.com/sova_ai',
    icon: ['fab', 'vk'],
  },
  {
    link: 'https://www.facebook.com/hello.sova',
    icon: ['fab', 'facebook-f'],
  },
  {
    link: 'https://twitter.com/hello_sova',
    icon: ['fab', 'twitter'],
  },
  {
    link: 'https://www.youtube.com/channel/UCLJtz3snnlYheeJM4Ox5CrQ',
    icon: ['fab', 'youtube'],
  },
  {
    link: 'https://medium.com/sova-ai',
    icon: ['fab', 'medium'],
  },
  {
    link: 'https://github.com/sovaai',
    icon: ['fab', 'github'],
  },
]

interface FormGroupOnLoginProps {
  handleChange(ev: React.FormEvent<HTMLInputElement>): void
}

const FormGroupOnLogin = React.memo<FormGroupOnLoginProps>(({ handleChange }) => {
  const [passwordShowState, togglePasswordShowState] = useState(false)
  return (
    <>
      <div className="loginRoute-formgroup">
        <input name="username" type="text" placeholder="E-mail" onChange={handleChange} required />
        <Icon className="loginRoute-icon" icon={['fas', 'user-circle']} />
      </div>
      <div className="loginRoute-formgroup loginRoute-formgroup_password">
        <input
          name="password"
          type={passwordShowState ? 'text' : 'password'}
          placeholder="Пароль"
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="loginRoute-icon-btn"
          onClick={() => togglePasswordShowState(!passwordShowState)}
        >
          <Icon icon={['far', 'eye']} />
        </button>
        <Icon className="loginRoute-icon" icon={['fas', 'lock']} />
      </div>
      <button type="submit" className="loginRoute-login">
        Войти
      </button>
    </>
  )
})

interface LoginRouteProps {
  client: ApolloClient<NormalizedCacheObject>
}

export class LoginRoute extends PureComponent<LoginRouteProps> {
  state = {
    username: '',
    password: '',
  }

  handleChange = (ev: React.FormEvent<HTMLInputElement>) => {
    ev.persist()
    const { name, value } = ev.currentTarget
    this.setState(() => ({ [name]: value }))
  }

  handleSubmit = async (ev?: React.FormEvent<HTMLFormElement>) => {
    if (ev) ev.preventDefault()

    const user = await basicAuth(this.state)
    if (!user) return

    const {
      accounts,
      theme,
      font_family,
      font_size,
      animation,
      editors_opened,
      fav_templates_expanded,
      comments_expanded,
      show_lines_count,
    } = user.user
    let settings = {
      theme: theme,
      fontFamily: font_family,
      fontSize: font_size,
      animation,
      editors_opened,
      fav_templates_expanded,
      comments_expanded,
      show_lines_count,
    }

    await saveUserInfo(user)
    await loadClientSettings(fromJS(settings))
    accounts && accounts.length && (await this.handleAccountSelect(Map(fromJS(accounts[0]))))
  }

  handleAccountSelect = async (account: Map<any, any>) => {
    selectAccount(account)
    await this.getAccountComplect(account.get('account_id'))
  }

  getAccountComplect = async (account_id: string) => {
    if (this.props.client) {
      const { data } = await this.props.client.query({
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

  componentDidMount() {
    HomeRoutePreload.preload()
    NotFoundRoutePreload.preload()
  }

  render() {
    const hideCopyright = process.env.REACT_APP_HIDE_NNS
    return (
      <div className="loginRoute">
        <div className="loginRoute-container">
          <h1 className="loginRoute-heading">SOVA IDE</h1>
          <form className="loginRoute-form" onSubmit={this.handleSubmit}>
            <FormGroupOnLogin handleChange={this.handleChange} />
          </form>

          {!hideCopyright && (
            <footer className="loginRoute-footer">
              <a
                className="loginRoute-mainSite-link"
                href="https://sova.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logoFooter} alt="Сайт SOVA" />
              </a>
              <ul className="loginRoute-social">
                {socialLinksConfig.map((li, i) => (
                  <li className="loginRoute-social-item" key={i}>
                    <a target="_blank" rel="noopener noreferrer" href={li.link}>
                      <Icon icon={li.icon} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="loginRoute-copyright">© 2020, SOVA</p>
            </footer>
          )}
        </div>
      </div>
    )
  }
}

export default withApollo<LoginRouteProps>(LoginRoute)
