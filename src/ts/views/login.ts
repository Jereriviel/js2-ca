import { loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";
import { validateForm } from "../utils/validation";
import { handleError } from "../errors/handleError";
import { renderView } from "../utils/protectedView";
import { loadingSpinner } from "../components/loadingSpinner";
import { toggleButtonLoading } from "../utils/toggleButtonLoading";

export function loginView() {
  return renderView({
    html: `
      <section class="flex flex-col h-lvh justify-center items-center bg-gradient-to-tr from-secondary-light to-secondary-ultra-light">
        <form id="loginForm">
          <fieldset id="loginFieldset" class="flex flex-col gap-8 w-fit items-center">
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
            <p id="loginError" class="error-message text-red-500 text-sm mt-2 text-center hidden"></p>
            <div class="flex flex-col gap-4 items-center">
              <button
                type="submit"
                id="loginBtn"
                class="bg-primary hover:bg-primary-hover text-white py-3 w-[300px] rounded-full flex justify-center items-center gap-2"
              >
                <span class="button-text">Sign in</span>
                <span class="spinner hidden">${loadingSpinner()}</span>
              </button>
              <button
                type="button"
                id="btnToStart"
                class="bg-secondary hover:bg-secondary-hover text-white py-3 w-[300px] rounded-full"
              >
                Back
              </button>
            </div>
          </fieldset>
        </form>
      </section>
    `,
    init: () => {
      const form = document.getElementById("loginForm") as HTMLFormElement;
      const fieldset = document.getElementById(
        "loginFieldset",
      ) as HTMLFieldSetElement;
      const errorEl = document.getElementById("loginError") as HTMLElement;
      const backBtn = document.getElementById(
        "btnToStart",
      ) as HTMLButtonElement;
      const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;

      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById(
        "password",
      ) as HTMLInputElement;
      const emailError = document.getElementById("emailError") as HTMLElement;
      const passwordError = document.getElementById(
        "passwordError",
      ) as HTMLElement;

      backBtn.addEventListener("click", () => goTo(`/`));

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        emailInput.classList.remove("border-red-500");
        passwordInput.classList.remove("border-red-500");
        emailError.classList.add("hidden");
        passwordError.classList.add("hidden");
        errorEl.classList.add("hidden");

        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const { isValid, errors } = validateForm(email, password);

        if (!isValid) {
          if (errors.email) {
            emailInput.classList.add("border-red-500");
            emailError.textContent = errors.email;
            emailError.classList.remove("hidden");
          }

          if (errors.password) {
            passwordInput.classList.add("border-red-500");
            passwordError.textContent = errors.password;
            passwordError.classList.remove("hidden");
          }

          return;
        }

        try {
          fieldset.disabled = true;
          toggleButtonLoading(loginBtn, true);

          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (error) {
          const message = handleError(error);
          errorEl.textContent = message;
          errorEl.classList.remove("hidden");
        } finally {
          toggleButtonLoading(loginBtn, false);
          fieldset.disabled = false;
        }
      });
    },
  });
}
