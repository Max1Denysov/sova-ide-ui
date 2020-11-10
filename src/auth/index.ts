import { setStatusBarNotification } from '../store/dispatcher'
import axios from 'axios'
import { loginUrl } from '../config/urlConfig'

const basicAuth = async (data: { username: string; password: string }) => {
  try {
    const user = await axios.post(loginUrl, data)
    return user.data
  } catch (error) {
    console.log(error)
    setStatusBarNotification({ msg: 'Ошибка авторизации', className: 'error' })
    return false
  }
}
export default basicAuth
