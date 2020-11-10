const prodution = process.env.NODE_ENV === 'production'

const REACT_APP_APP_DATA_URL = process.env.REACT_APP_APP_DATA_URL
const REACT_APP_LOGIN_URL = process.env.REACT_APP_LOGIN_URL

let appDataUrlBasic = prodution ? 'http://localhost:8443/graphql' : 'http://localhost:8443/graphql'
let loginUrlBasic = prodution ? 'http://localhost:8443/login' : 'http://localhost:8443/login'

export const appDataUrl = REACT_APP_APP_DATA_URL ? REACT_APP_APP_DATA_URL : appDataUrlBasic
export const loginUrl = REACT_APP_LOGIN_URL ? REACT_APP_LOGIN_URL : loginUrlBasic
