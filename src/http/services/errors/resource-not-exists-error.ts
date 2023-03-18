export class ResourceNotExistsException extends Error {
  constructor() {
    super('Resource not found.')
  }
}
