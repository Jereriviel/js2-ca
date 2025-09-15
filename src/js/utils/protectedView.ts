import { isLoggedIn } from "../store/userStore";
import { goTo } from "../utils/navigate";

interface ProtectedView {
  html: string;
  init?: () => void | Promise<void>;
}

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
