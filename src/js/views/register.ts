import { registerUser, loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";
import { validateForm } from "../utils/validation";
import { handleError } from "../errors/handleError";
import { renderView } from "../utils/protectedView";
import { loadingSpinner } from "../components/loadingSpinner";

export function registerView() {
  renderView({
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
            <p id="registerError" class="error-message" style="display: none"></p>
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
      const backBtn = document.getElementById("btnToStart")!;
      const registerBtn = document.getElementById(
        "registerBtn",
      ) as HTMLButtonElement;
      const buttonText = registerBtn.querySelector(
        ".button-text",
      ) as HTMLElement;
      const spinner = registerBtn.querySelector(".spinner") as HTMLElement;

      backBtn.addEventListener("click", () => goTo(`/`));

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorEl.textContent = "";
        errorEl.style.display = "none";

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
          errorEl.textContent =
            errors.email ||
            errors.password ||
            errors.confirmPassword ||
            "Invalid input";
          errorEl.style.display = "block";
          return;
        }

        fieldset.disabled = true;
        buttonText.classList.add("hidden");
        spinner.classList.remove("hidden");
        registerBtn.classList.add("opacity-80");

        try {
          await registerUser(name, email, password);
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
          registerBtn.classList.remove("opacity-80");
        }
      });
    },
  });
}
