import { goTo } from "../utils/navigate";

export function feedHeader(current: "feed" | "following"): string {
  const feedIsActive = current === "feed";
  const followingIsActive = current === "following";

  return `
    <header class="feed-header">
      <h1>${
        feedIsActive ? "Feed" : `<a href="/feed" class="feed-link">Feed</a>`
      }</h1>
      <h1>${
        followingIsActive
          ? "Following"
          : `<a href="/feed/following" class="following-link">Following</a>`
      }</h1>
    </header>
  `;
}

export function initFeedHeader(container: HTMLElement) {
  container.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest("a");
    if (target && target.getAttribute("href")) {
      e.preventDefault();
      goTo(target.getAttribute("href")!);
    }
  });
}
