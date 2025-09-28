import { isLoggedIn } from "../store/userStore";
import { goTo } from "../utils/navigate";

interface ProtectedView {
  html: string;
  init?: () => void | Promise<void>;
}

/**
 * Renders a view that is protected behind authentication.
 *
 * Checks if the user is logged in using `isLoggedIn()`.
 * If the user is not logged in, it redirects to the homepage ("/")
 * and returns an empty view.
 *
 * @param {Object} options - The options for the protected view.
 * @param {string} options.html - The HTML string to render if the user is logged in.
 * @param {() => void | Promise<void>} [options.init] - Optional initialization function
 *        to run after the view is rendered. Can be synchronous or asynchronous.
 *
 * @returns {{ html: string, init: () => void | Promise<void> }} The view object containing
 *          the HTML to render and the initialization function.
 *
 * @example
 * const view = protectedView({
 *   html: '<div>Secret content</div>',
 *   init: () => console.log('View initialized')
 * });
 */

export function protectedView({ html, init }: ProtectedView) {
  if (!isLoggedIn()) {
    setTimeout(() => goTo("/"), 0);
    return {
      html: ``,
      init: () => {},
    };
  }

  return { html, init: init ?? (() => {}) };
}
