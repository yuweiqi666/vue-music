export const getLocalItem = (key) => {
  const result = localStorage.getItem(key)
  try {
    return JSON.parse(result)
  } catch (error) {
    return result
  }
}

export const setLocalItem = (key, value) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}

export const removeLocalItem = (key) => {
  localStorage.removeItem(key)
}
