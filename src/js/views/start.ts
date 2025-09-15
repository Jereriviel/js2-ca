import { goTo } from "../utils/navigate";
import { isLoggedIn } from "../store/userStore";

export function startView() {
  if (isLoggedIn()) {
    setTimeout(() => goTo("/feed"), 0);
    return {
      html: ``,
      init: () => {},
    };
  }

  return {
    html: `
      <section class="start-page">
        <h1>Hearth</h1>
        <p>Your Stories, Your Community</p>
        <div class="buttons">
          <button id="btnLogin">Sign In</button>
          <button id="btnRegister">Create Account</button>
        </div>
      </section>
    `,
    init: () => {
      const loginBtn = document.getElementById("btnLogin")!;
      const registerBtn = document.getElementById("btnRegister")!;

      loginBtn.addEventListener("click", () => goTo("/login"));
      registerBtn.addEventListener("click", () => goTo("/register"));
    },
  };
}
