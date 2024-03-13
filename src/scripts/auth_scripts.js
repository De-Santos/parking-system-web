import axios from 'axios'

export async function handleLogin(dto) {
  const response = {
    error: null,
    token: null
  }
  try {
    let r = await axios.post(`/login`, dto)
    response.token = r.data.token
  } catch (e) {
    response.error = e
  }
  return response
}

export async function handleRegister(dto) {
  const response = {
    error: null
  }
  try {
    await axios.post(`/signup`, dto)
  } catch (e) {
    response.error = e
  }
  return response
}

export async function usernameCheck(username) {
  if (username === '') return false
  return axios.get(`/username?s=${username}`)
    .catch(err => {
      console.log(err)
    })
    .then(res => {
      return res.data === true
    })
}

export function validateAuthForm(dto, isLoginForm) {
  const errorMap = {
    fullName: '',
    username: '',
    password: ''
  }
  if (isLoginForm === false) {
    errorMap.fullName = validateFullName(dto.full_name)
  }
  errorMap.username = validateUsername(dto.username)
  errorMap.password = validatePassword(dto.password)
  return errorMap
}

export function validateFullName(s) {
  if (!s || s.trim() === '') {
    return 'Full name can\'t be empty'
  }
  return null
}

export function validateUsername(s) {
  if (!s || s.trim() === '') {
    return 'Username can\'t be empty'
  }

  if (s.length < 4) {
    return 'Username must be at least 4 characters long'
  }

  if (s.length > 50) {
    return 'Username can\'t exceed 50 characters'
  }
  return null
}

export function validatePassword(s) {
  if (!s || s.trim() === '') {
    return 'Username can\'t be empty'
  }

  if (s.length < 4) {
    return 'Password must be at least 4 characters long'
  }

  if (s.length > 50) {
    return 'Password can\'t exceed 50 characters'
  }
  return null
}

