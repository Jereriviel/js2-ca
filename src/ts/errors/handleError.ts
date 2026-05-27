import { ApiError } from "./ApiError";

export function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return "Bad request. Please try again.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "You don't have permission to do that.";
      case 404:
        return "The requested resource was not found.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "Server error. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
