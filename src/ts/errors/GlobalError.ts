import { handleError } from "./handleError";

export function initGlobalErrorHandling(): void {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error("[Global Error]", { message, source, lineno, colno, error });
    handleError(error || new Error(String(message)));
    return true;
  };

  window.onunhandledrejection = (event) => {
    console.error("[Unhandled Promise Rejection]", event.reason);
    handleError(event.reason);
  };
}
