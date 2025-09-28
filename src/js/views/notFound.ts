import { goTo } from "../utils/navigate";

export function notFoundView() {
  return {
    html: `
    <section class="flex flex-col gap-4 items-center mt-12">
    <div class="flex flex-col items-center">
      <figure class="max-w-[200px]">
        <img
          class="rounded-full w-full h-full object-cover"
          src="/img/404.jpg"
          alt="Not found illustration."
        />
      </figure>
      <h1 class="text-7xl font-bold text-primary">404</h1>
      <h2 class="text-xl font-semibold">Page not found</h2>
      </div>
      <div class="flex flex-col items-center">
      <p>
        Oops, the page you requested does not exist or has been moved.</p>
      <p>Try going
        back to the homepage.
      </p>
      </div>
      <button
        id="btnBackStart"
        class="bg-primary hover:bg-primary-hover text-white w-fit py-5 px-5 rounded-full"
      >
        Back to Home
      </button>
    </section>
    `,
    init: () => {
      const backButton = document.getElementById("btnBackStart")!;
      backButton.addEventListener("click", () => {
        goTo("/");
      });
    },
  };
}
