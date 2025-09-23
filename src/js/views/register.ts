import { registerUser, loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";

export function registerView() {
  return {
    html: `
      <form id="registerForm">
        <input type="text" name="name" required placeholder="Username" />
        <input type="email" name="email" required placeholder="Email (stud.noroff.no)" />
        <input type="password" name="password" required placeholder="Password" minlength="8" />
        <input type="password" name="confirmPassword" required placeholder="Confirm Password" minlength="8" />
        <button type="submit">Register</button>
        <p id="registerError"></p>
      </form>
    `,
    init: () => {
      const form = document.getElementById("registerForm") as HTMLFormElement;
      const errorEl = document.getElementById("registerError") as HTMLElement;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorEl.textContent = "";

        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
          errorEl.textContent = "Passwords do not match.";
          return;
        }

        try {
          await registerUser(name, email, password);
          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (error) {
          errorEl.textContent =
            error instanceof Error
              ? error.message
              : "An unknown error occurred.";
        }
      });
    },
  };
}
