import { BaseError } from "./BaseError";

export class ApiError extends BaseError {
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, "ApiError");
    this.details = details;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let message = `HTTP Error: ${response.status} ${response.statusText}`;
    let details: unknown = undefined;

    try {
      const json = await response.json();
      details = json;
      if (typeof json.message === "string") {
        message = json.message;
      }
    } catch (parseError) {
      console.warn("Failed to parse error response as JSON:", parseError);
    }

    return new ApiError(message, response.status, details);
  }
}
