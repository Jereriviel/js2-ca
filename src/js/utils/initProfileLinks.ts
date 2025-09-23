import { goTo } from "./navigate";

export function initProfileLinks(container: HTMLElement) {
  container.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(
      ".profile-link"
    ) as HTMLElement | null;
    if (target?.dataset.username) {
      goTo(`/profile/${target.dataset.username}`);
    }
  });
}
