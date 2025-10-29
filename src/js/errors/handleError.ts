import { ApiError } from "./ApiError";
import { showUserMessage } from "../components/toasts/userMessage";

export function handleError(error: unknown): void {
  if (error instanceof ApiError) {
    console.error(`[API Error] ${error.statusCode}: ${error.message}`);

    switch (error.statusCode) {
      case 400:
        showUserMessage("Bad request. Please try again.");
        break;

      case 401:
        showUserMessage("Your session has expired. Please log in again.");
        break;

      case 403:
        showUserMessage("You don't have permission to do that.");
        break;

      case 404:
        showUserMessage("The requested resource was not found.");
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        showUserMessage("Server error. Please try again later.");
        break;

      default:
        showUserMessage("An unexpected error occurred.");
        break;
    }
  } else if (error instanceof Error) {
    console.error(`[General Error] ${error.message}`);
    showUserMessage(error.message);
  } else {
    console.error("[Unknown Error]", error);
    showUserMessage("Something went wrong. Please try again.");
  }
}
