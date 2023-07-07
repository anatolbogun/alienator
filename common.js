const assignValue = (defaults, value) => {
  if (typeof value === 'object' || value === undefined) {
    return { ...defaults, ...value }
  }

  return Object.fromEntries(Object.keys(defaults).map((key) => [key, value]))
}

export { assignValue }
