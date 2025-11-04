import { isLoggedIn } from "../store/userStore";
import { goTo } from "../utils/navigate";

/**
 * Renders any view (public or protected) into the DOM.
 *
 * It automatically replaces the contents of:
 * - <header> with the provided `header` HTML (or clears it if none given)
 * - #app with the provided `html`
 * - <footer> with the provided `footer` HTML (or clears it if none given)
 *
 * @param {Object} options - The options for rendering a view.
 * @param {string} options.html - The main HTML to render inside #app.
 * @param {() => void | Promise<void>} [options.init] - Optional function to run after render.
 * @param {string} [options.header] - Optional header HTML.
 * @param {string} [options.footer] - Optional footer HTML.
 */
export function renderView({
  html,
  init,
  header,
  footer,
}: {
  html: string;
  init?: () => void | Promise<void>;
  header?: string;
  footer?: string;
}) {
  const headerEl = document.querySelector("header");
  const footerEl = document.querySelector("footer");
  const app = document.getElementById("app");

  if (headerEl) headerEl.innerHTML = header ?? "";
  if (footerEl) footerEl.innerHTML = footer ?? "";
  if (app) app.innerHTML = html;

  if (init) init();
}

/**
 * Renders a view that is protected behind authentication.
 *
 * Redirects to "/" if the user is not logged in.
 */
export function protectedView({
  html,
  init,
  header,
  footer,
}: {
  html: string;
  init?: () => void | Promise<void>;
  header?: string;
  footer?: string;
}) {
  if (!isLoggedIn()) {
    setTimeout(() => goTo("/"), 0);
    return {
      html: ``,
      init: () => {},
    };
  }

  renderView({ html, init, header, footer });
  return { html, init: init ?? (() => {}) };
}
