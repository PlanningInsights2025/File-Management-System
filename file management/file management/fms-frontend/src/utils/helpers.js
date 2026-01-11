export function formatDate(d) {
  const date = d ? new Date(d) : new Date()
  return date.toLocaleString()
}

// localStorage helpers
export function getLS(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export function setLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}
