import { goTo } from "../utils/navigate";

export function feedHeader(current: "feed" | "following"): string {
  const feedIsActive = current === "feed";
  const followingIsActive = current === "following";

  return `
<header class="feed-header flex items-start justify-around pt-8 font-semibold text-l">
  <h1 class="${feedIsActive ? "border-b-3 border-primary pb-2" : ""}">
    ${feedIsActive ? "Feed" : `<a href="/feed" class="feed-link">Feed</a>`}
  </h1>
  <h1 class="${followingIsActive ? "border-b-3 border-primary pb-2" : ""}">
    ${
      followingIsActive
        ? "Following"
        : `<a href="/feed/following" class="following-link">Following</a>`
    }
  </h1>
</header>
    <hr class="h-[1px] bg-gray-medium border-none mt-4">
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
