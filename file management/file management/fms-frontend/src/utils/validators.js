export function isRequired(v) {
  return v !== undefined && v !== null && String(v).trim() !== ''
}
