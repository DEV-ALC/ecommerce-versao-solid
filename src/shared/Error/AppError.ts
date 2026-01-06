export class AppError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
