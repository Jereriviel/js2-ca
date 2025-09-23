import { loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";

export function loginView() {
  return {
    html: `
      <form id="loginForm">
        <input type="email" name="email" required placeholder="Email" />
        <input type="password" name="password" required placeholder="Password" />
        <button type="submit">Login</button>
        <p id="loginError" class="error-message" style="color: red; display: none;"></p>
      </form>
    `,
    init: () => {
      const form = document.getElementById("loginForm") as HTMLFormElement;
      const errorEl = document.getElementById("loginError") as HTMLElement;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (err) {
          errorEl.textContent = "Login failed. Please check your credentials.";
          errorEl.style.display = "block";
        }
      });
    },
  };
}
