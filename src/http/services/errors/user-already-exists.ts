export class UserAlreadyExistsException extends Error {
  constructor() {
    super('E-mail already exists')
  }
}
