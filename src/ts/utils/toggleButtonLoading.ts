import { loadingSpinner } from "../components/loadingSpinner";

/**
 * Toggles a button's loading state with a spinner and text visibility.
 *
 * @param button - The button element to toggle.
 * @param isLoading - Whether to enable (true) or disable (false) loading state.
 * @param loadingText - Optional text for accessibility.
 */

export function toggleButtonLoading(
  button: HTMLButtonElement,
  isLoading: boolean,
  loadingText = "Loading...",
): void {
  let buttonText = button.querySelector(".button-text") as HTMLElement;
  let spinner = button.querySelector(".spinner") as HTMLElement;

  if (!buttonText) {
    const text = document.createElement("span");
    text.className = "button-text";
    text.textContent = button.textContent || "";
    button.textContent = "";
    button.appendChild(text);
    buttonText = text;
  }

  if (!spinner) {
    const span = document.createElement("span");
    span.className = "spinner hidden";
    span.innerHTML = loadingSpinner();
    button.appendChild(span);
    spinner = span;
  }

  if (isLoading) {
    button.disabled = true;
    button.classList.add("opacity-80");
    buttonText.classList.add("hidden");
    spinner.classList.remove("hidden");
    button.setAttribute("aria-busy", "true");
    button.setAttribute("aria-label", loadingText);
  } else {
    button.disabled = false;
    button.classList.remove("opacity-80");
    buttonText.classList.remove("hidden");
    spinner.classList.add("hidden");
    button.removeAttribute("aria-busy");
    button.removeAttribute("aria-label");
  }
}
