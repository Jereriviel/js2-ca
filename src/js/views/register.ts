import { registerUser, loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";

export function registerView() {
  return {
    html: `
    <section class="flex flex-col h-lvh justify-center items-center">
 <form
      id="registerForm"
      class="flex flex-col gap-8 w-fit"
    >
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
           minlength: 8,
           id: "password",
         })}
         ${input({
           type: "password",
           name: "confirmPassword",
           placeholder: "Re-enter your password",
           required: true,
           label: "Confirm password",
           minlength: 8,
           id: "confirmPassword",
         })}
      </div>
    <div class="flex flex-col gap-4 items-center">
      <button
        type="submit"
        class="bg-primary hover:bg-primary-hover text-white py-6 w-[300px] rounded-full"
      >
        Register
      </button>
      <button
        type="button"
        id="btnToStart"
        class="bg-secondary hover:bg-secondary-hover text-white py-6 w-[300px] rounded-full"
      >
        Back
      </button>
    </div>
      <p id="registerError"></p>
    </form>
    </section>
    `,
    init: () => {
      const form = document.getElementById("registerForm") as HTMLFormElement;
      const errorEl = document.getElementById("registerError") as HTMLElement;
      const backBtn = document.getElementById("btnToStart")!;

      backBtn.addEventListener("click", () => goTo(`/`));

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
