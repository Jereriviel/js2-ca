import { ApiError } from "./ApiError";

export function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    console.error(`[API Error] ${error.statusCode}: ${error.message}`);

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
        return "An unexpected error occurred.";
    }
  } else if (error instanceof Error) {
    console.error(`[General Error] ${error.message}`);
    return error.message;
  } else {
    console.error("[Unknown Error]", error);
    return "Something went wrong. Please try again.";
  }
}
