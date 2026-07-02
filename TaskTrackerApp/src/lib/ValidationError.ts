export class ValidationError extends Error {
  readonly fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super('Validation failed')
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export function parseValidationErrors(message: string): Record<string, string> {
  return Object.fromEntries(
    message.split('; ').map(chunk => {
      const colonIdx = chunk.indexOf(': ')
      if (colonIdx === -1) return ['_form', chunk]
      return [chunk.slice(0, colonIdx).toLowerCase(), chunk.slice(colonIdx + 2)]
    })
  )
}
