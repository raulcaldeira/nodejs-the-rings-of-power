export class BearerAlreadyExistsForThisRingError extends Error {
  constructor() {
    super('Já existe um portador para esse anél.')
  }
}
