export const isStringPositiveInteger = (value: any) => {
  return /^\d+$/.test(value) && parseInt(value) >= 0
}
