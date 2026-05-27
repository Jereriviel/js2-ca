import { goTo } from "../../utils/navigate";

export function feedHeader(current: "feed" | "following"): string {
  const feedIsActive = current === "feed";
  const followingIsActive = current === "following";

  return `
        <figure class="w-full flex justify-center pt-2 sm:pt-4 sm:hidden">
        <img
          class=""
          src="/img/hearth_logo_24x24.png"
          alt="Hearth logo"
        />
      </figure>
              <figure class="w-full sm:flex justify-center pt-2 sm:pt-4 hidden">
        <img
          class=""
          src="/img/hearth_logo_32x32.png"
          alt="Hearth logo"
        />
      </figure>
<div class="feed-header flex items-start justify-around font-semibold text-l">
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
</div>
    <hr  class= "text-gray-medium">
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
