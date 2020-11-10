/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    REACT_APP_APP_DATA_URL: string | undefined
    REACT_APP_FAQ_DATA_URL: string | undefined
    REACT_APP_LOGIN_URL: string | undefined
    REACT_APP_IMAGE_DATA_URL: string | undefined
    REACT_APP_AUTH_SERVER: string | undefined
    REACT_APP_TAILWIND_CONFIG: string | undefined
    REACT_APP_HIDE_NNS: string | undefined
  }
}
