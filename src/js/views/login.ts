import { loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";
import { validateForm } from "../utils/validation";
import { handleError } from "../errors/handleError";
import { renderView } from "../utils/protectedView";
import { loadingSpinner } from "../components/loadingSpinner";

export function loginView() {
  renderView({
    html: `
      <section class="flex flex-col h-lvh justify-center items-center bg-gradient-to-tr from-secondary-light to-secondary-ultra-light">
        <form id="loginForm">
          <fieldset id="loginFieldset" class="flex flex-col gap-8 w-fit">
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
            <p id="loginError" class="error-message" style="display: none"></p>
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
      const backBtn = document.getElementById("btnToStart")!;
      const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
      const buttonText = loginBtn.querySelector(".button-text") as HTMLElement;
      const spinner = loginBtn.querySelector(".spinner") as HTMLElement;

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

        fieldset.disabled = true;
        buttonText.classList.add("hidden");
        spinner.classList.remove("hidden");
        loginBtn.classList.add("opacity-80");

        try {
          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (error) {
          const message = handleError(error);
          errorEl.textContent = message;
          errorEl.style.display = "block";
        } finally {
          fieldset.disabled = false;
          buttonText.classList.remove("hidden");
          spinner.classList.add("hidden");
          loginBtn.classList.remove("opacity-80");
        }
      });
    },
  });
}
