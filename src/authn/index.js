import { clear as clearToken } from './token'
import { clear as clearUser, load } from './user'

export const login = () => {
  // normally this would be a POST api/login?client-id={seed} 
  // and the api would respond with a 302 to /home?access-token=...
  // but I couldn't get this dance to work with httpbin.org/redirect-to because of CORS stuff so
  // I'm just simulating it.
  location = `${location.origin}/home?access-token=817b084g61n5&token-type=Bearer`

  load({
    id: 1,
    first: 'Happy',
    last: 'Gilmore',
    email: 'happy@example.org',
  })
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