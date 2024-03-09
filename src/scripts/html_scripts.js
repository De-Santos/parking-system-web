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
  return param !== null ? `${param}-${uuid()}` : `${uuid()}`
}


export function buildSmallId(param) {
  return param !== null ? `${param}-${buildSmallUUID()}` : `${buildSmallUUID()}`
}


function buildSmallUUID() {
  const fullUUID = uuid() // Generate a full UUID
  return fullUUID.split('-')[0]
}

export function emulateClick(id) {
  const button = document.getElementById(id);
  button.click()
}
