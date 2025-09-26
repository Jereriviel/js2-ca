import { loginUser } from "../services/authService";
import { renderLayout } from "../app";
import { goTo } from "../utils/navigate";
import { input } from "../components/inputs";

export function loginView() {
  return {
    html: `
    <section class="flex flex-col h-lvh justify-center items-center">
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
          id: "email,",
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
