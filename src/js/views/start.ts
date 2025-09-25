import { goTo } from "../utils/navigate";
import { isLoggedIn } from "../store/userStore";

export function startView() {
  if (isLoggedIn()) {
    setTimeout(() => goTo("/feed"), 0);
    return {
      html: ``,
      init: () => {},
    };
  }

  return {
    html: `
    <section class="flex flex-col gap-12 h-lvh justify-center text-lg">
      <div class="flex flex-col items-center gap-2">
        <figure class="w-[100px]">
          <img
            src="/public/img/hearth_logo_144x144.png"
            alt="Hearth logo depicting a fireplace with a flame inside."
          />
        </figure>
        <h1 class="font-display text-[40px] text-primary">HEARTH</h1>
        <p>Your Stories, Your Community</p>
      </div>
      <div class="flex flex-col gap-4 items-center">
        <button id="btnLogin" class=" bg-primary hover:bg-primary-hover text-white py-6 w-[300px] rounded-full">Sign In</button>
        <button id="btnRegister" class=" bg-secondary hover:bg-secondary-hover text-white py-6 w-[300px] rounded-full">Create Account</button>
      </div>
    </section>
    `,
    init: () => {
      const loginBtn = document.getElementById("btnLogin")!;
      const registerBtn = document.getElementById("btnRegister")!;

      loginBtn.addEventListener("click", () => goTo("/login"));
      registerBtn.addEventListener("click", () => goTo("/register"));
    },
  };
}
