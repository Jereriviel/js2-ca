import { registerUser, loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";
import { validateForm } from "../utils/validation";
import { handleError } from "../errors/handleError";
import { renderView } from "../utils/protectedView";
import { loadingSpinner } from "../components/loadingSpinner";
import { toggleButtonLoading } from "../utils/toggleButtonLoading";

export function registerView() {
  return renderView({
    html: `
      <section class="flex flex-col h-lvh justify-center items-center bg-gradient-to-tr from-secondary-light to-secondary-ultra-light">
        <form id="registerForm">
          <fieldset id="registerFieldset" class="flex flex-col gap-8 w-fit">
            <h1 class="text-2xl font-semibold flex self-start">Create Account</h1>
            <div class="flex flex-col gap-4">
              ${input({
                type: "text",
                name: "name",
                placeholder: "Enter username",
                required: true,
                label: "Username",
                id: "name",
              })}
              ${input({
                type: "email",
                name: "email",
                placeholder: "Enter email (@stud.noroff.no)",
                required: true,
                label: "Email address",
                id: "email",
              })}
              ${input({
                type: "password",
                name: "password",
                placeholder: "Choose your password",
                required: true,
                label: "Password",
                id: "password",
              })}
              ${input({
                type: "password",
                name: "confirmPassword",
                placeholder: "Re-enter your password",
                required: true,
                label: "Confirm password",
                id: "confirmPassword",
              })}
            </div>
            <p id="registerError" class="text-red-500 text-sm text-center hidden"></p>
            <div class="flex flex-col gap-4 items-center">
              <button
                type="submit"
                id="registerBtn"
                class="bg-primary hover:bg-primary-hover text-white py-3 w-[300px] rounded-full flex justify-center items-center gap-2"
              >
                <span class="button-text">Register</span>
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
      const form = document.getElementById("registerForm") as HTMLFormElement;
      const fieldset = document.getElementById(
        "registerFieldset",
      ) as HTMLFieldSetElement;
      const errorEl = document.getElementById("registerError") as HTMLElement;
      const backBtn = document.getElementById(
        "btnToStart",
      ) as HTMLButtonElement;
      const registerBtn = document.getElementById(
        "registerBtn",
      ) as HTMLButtonElement;

      const nameInput = document.getElementById("name") as HTMLInputElement;
      const emailInput = document.getElementById("email") as HTMLInputElement;
      const passwordInput = document.getElementById(
        "password",
      ) as HTMLInputElement;
      const confirmInput = document.getElementById(
        "confirmPassword",
      ) as HTMLInputElement;

      const nameError = document.getElementById("nameError") as HTMLElement;
      const emailError = document.getElementById("emailError") as HTMLElement;
      const passwordError = document.getElementById(
        "passwordError",
      ) as HTMLElement;
      const confirmError = document.getElementById(
        "confirmPasswordError",
      ) as HTMLElement;

      backBtn.addEventListener("click", () => goTo(`/`));

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        [nameInput, emailInput, passwordInput, confirmInput].forEach((input) =>
          input.classList.remove("border-red-500"),
        );
        [nameError, emailError, passwordError, confirmError].forEach((el) =>
          el.classList.add("hidden"),
        );
        errorEl.classList.add("hidden");

        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        const { isValid, errors } = validateForm(
          email,
          password,
          confirmPassword,
        );

        if (!isValid) {
          if (errors.name) {
            nameInput.classList.add("border-red-500");
            nameError.textContent = errors.name;
            nameError.classList.remove("hidden");
          }
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
          if (errors.confirmPassword) {
            confirmInput.classList.add("border-red-500");
            confirmError.textContent = errors.confirmPassword;
            confirmError.classList.remove("hidden");
          }
          return;
        }

        try {
          toggleButtonLoading(registerBtn, true);
          fieldset.disabled = true;

          await registerUser(name, email, password);
          await loginUser(email, password);
          await renderLayout();
          goTo("/feed");
        } catch (error) {
          const message = handleError(error);
          errorEl.textContent = message;
          errorEl.classList.remove("hidden");
        } finally {
          toggleButtonLoading(registerBtn, false);
          fieldset.disabled = false;
        }
      });
    },
  });
}
