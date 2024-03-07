import Cookies from 'universal-cookie';
export const cookies = new Cookies(null, { path: '/' });

export const c_binds = {
  auth_token: 'Authorization'
}
