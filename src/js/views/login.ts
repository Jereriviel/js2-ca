import { loginUser } from "../services/authService";
import type { LoginResponseData } from "../types/auth";
import { router } from "../app";

export function loginView() {
  return {
    html: `
      <form id="loginForm">
        <input type="email" name="email" required placeholder="Email" />
        <input type="password" name="password" required placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    `,
    init: () => {
      const form = document.getElementById("loginForm") as HTMLFormElement;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
          const user: LoginResponseData = await loginUser(email, password);
          console.log("Logged in as:", user.name);
          router.navigate("/feed");
        } catch (err) {
          alert("Login failed. Please check your credentials.");
        }
      });
    },
  };
}
