import React from 'react'
import DefaultLayout from '../layouts/defaultLayout'
import lazyWithPreload from '../utils/lazyPreload'

interface HomeProps {
  toolbarFrame: React.ComponentType
  workareaFrame: React.ComponentType
  renderAccountsList?: boolean
  isChatDisabled?: boolean
}

export const LoginRoutePreload = lazyWithPreload(() => import(/* webpackChunkName: 'loginPage' */ './pages/loginRoute'))
export const HomeRoutePreload = lazyWithPreload(() => import(/* webpackChunkName: 'basicPage' */ './pages/homeRoute'))
export const NotFoundRoutePreload = lazyWithPreload(() => import(/* webpackChunkName: 'notFountPage' */ './pages/notFoundRoute'))
export const ErrorRoutePreload = lazyWithPreload(() => import(/* webpackChunkName: 'errorPage' */ './pages/errorRoute'))

export const Login = React.memo(() => (
  <DefaultLayout>
    <LoginRoutePreload/>
  </DefaultLayout>
))

export const Home = React.memo<HomeProps>(({ toolbarFrame, workareaFrame, renderAccountsList, isChatDisabled }) => (
  <DefaultLayout>
    <HomeRoutePreload
      toolbarFrame={toolbarFrame}
      workareaFrame={workareaFrame}
      renderAccountsList={!!renderAccountsList}
      isChatDisabled={!!isChatDisabled}
    />
  </DefaultLayout>
))

export const NotFound = React.memo(() => (
  <DefaultLayout>
    <NotFoundRoutePreload/>
  </DefaultLayout>
))

export const Error = React.memo(() => (
  <DefaultLayout>
    <ErrorRoutePreload/>
  </DefaultLayout>
))