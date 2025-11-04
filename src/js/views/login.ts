import { loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";
import { validateForm } from "../utils/validation";
import { handleError } from "../errors/handleError";
import { renderView } from "../utils/protectedView";

export function loginView() {
  renderView({
    html: `
      <section class="flex flex-col h-lvh justify-center items-center bg-gradient-to-tr from-secondary-light to-secondary-ultra-light">
        <form
          id="loginForm"
          class="flex flex-col gap-8 w-fit"
        >
          <h1 class="text-2xl font-semibold flex self-start">Sign in</h1>
          <div class="flex flex-col gap-4">
            ${input({
              type: "email",
              name: "email",
              placeholder: "Email",
              required: true,
              label: "Email address",
              id: "email",
            })}
            ${input({
              type: "password",
              name: "password",
              placeholder: "Password",
              required: true,
              label: "Password",
              id: "password",
            })}
          </div>
          <div class="flex flex-col gap-4 items-center">
            <button
              type="submit"
              class="bg-primary hover:bg-primary-hover text-white py-6 w-[300px] rounded-full"
            >
              Sign in
            </button>
            <button
              type="button"
              id="btnToStart"
              class="bg-secondary hover:bg-secondary-hover text-white py-6 w-[300px] rounded-full"
            >
              Back
            </button>
          </div>
          <p
            id="loginError"
            class="error-message"
            style="display: none"
          ></p>
        </form>
      </section>
    `,
    init: () => {
      const form = document.getElementById("loginForm") as HTMLFormElement;
      const errorEl = document.getElementById("loginError") as HTMLElement;
      const backBtn = document.getElementById("btnToStart")!;

      backBtn.addEventListener("click", () => goTo(`/`));

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const { isValid, errors } = validateForm(email, password);

        if (!isValid) {
          errorEl.textContent =
            errors.email || errors.password || "Invalid input";
          errorEl.style.display = "block";
          return;
        } else {
          errorEl.style.display = "none";
        }

        try {
          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (error) {
          const message = handleError(error);
          errorEl.textContent = message;
          errorEl.style.display = "block";
        }
      });
    },
  });
}
