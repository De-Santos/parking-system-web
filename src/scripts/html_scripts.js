import { v4 as uuid } from 'uuid'

export function setInvalid(id) {
  const inputField = document.getElementById(id)
  inputField.classList.add('is-invalid')
}

export function setValid(id) {
  const inputField = document.getElementById(id)
  inputField.classList.remove('is-invalid')
}

export function validateInput(id) {
  const inputField = document.getElementById(id)

  // Validation logic
  if (inputField.value.trim() === '') {
    inputField.classList.add('is-invalid')
  }
}

export function buildId(param) {
  return param !== null ? `${uuid()}` : `${param}-${uuid()}`
}
