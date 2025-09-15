import { goTo } from "../utils/navigate";

export function notFoundView() {
  return {
    html: `
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>Oops, the page you requested does not exist or has been moved. Try going back to the homepage.</p>
      <button id="btnBackStart">Back to Home/button>
    `,
    init: () => {
      const backButton = document.getElementById("btnBackStart")!;
      backButton.addEventListener("click", () => {
        goTo("/");
      });
    },
  };
}
