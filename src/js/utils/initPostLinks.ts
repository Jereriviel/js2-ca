import { goTo } from "./navigate";

export function initPostLinks(container: HTMLElement) {
  container.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(
      ".post-link"
    ) as HTMLElement | null;

    if (target?.dataset.id) {
      goTo(`/post/${target.dataset.id}`);
    }
  });
}
