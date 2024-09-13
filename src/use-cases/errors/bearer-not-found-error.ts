export class BearerNotFoundError extends Error {
  constructor() {
    super('Portador não encontrado.')
  }
}
