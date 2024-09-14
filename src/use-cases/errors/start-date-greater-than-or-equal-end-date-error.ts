export class StartDateGreaterThanOrEqualEndDate extends Error {
  constructor() {
    super('A data final não pode ser maior que a data inicial.')
  }
}
