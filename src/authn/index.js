import { clear as clearToken, getSeed } from './token'
import { clear as clearUser } from './user'
import { CREATE as POST } from '../data'
import { throwError } from '../error'

export const login = async () => {
  // TEMP - for fake auth
  clearToken()
  
  /** @todo Re-enable this once real authentication is done. */
  // const responseData = await POST(`auth/login/?client-id=${getSeed()}`)
  // if (responseData.RedirectURL) {
  //   location = responseData.RedirectURL
  // } else {
  //   throwError('Unexpected response during login: ' + responseData)
  // }
}

export const logout = () => {
  // normally this would be a GET api/logout?token={getToken()} 
  // and the api would respond with a 302 to /login or a /logged-out page
  // but I couldn't get this dance to work with httpbin.org/redirect-to because of CORS stuff so
  // I'm just simulating it.
  location = `${location.origin}/logged-out`

  clearToken()
  clearUser()
}