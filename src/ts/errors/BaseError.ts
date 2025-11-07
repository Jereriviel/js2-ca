export abstract class BaseError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, name: string = "BaseError") {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
