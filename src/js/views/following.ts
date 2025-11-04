import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import { getPaginatedFollowingPosts } from "../services/postsService";
import type { Profile } from "../types/profile";
import { initPaginatedList } from "../utils/initPaginatedList";
import { feedHeader, initFeedHeader } from "../components/headers/feedHeader";
import { goTo } from "../utils/navigate";
import { footer } from "../components/footer";

export function followingView() {
  const headerElement = document.querySelector("header");
  if (headerElement) {
    headerElement.innerHTML = feedHeader("following");
  }

  const footerElement = document.querySelector("footer");
  if (footerElement) {
    footerElement.innerHTML = footer();
  }

  return protectedView({
    html: `
      <section id="followingContainer"></section>
      <section id="loadMoreContainer" class="load-more-container flex justify-center py-8"></section>
    `,
    init: async () => {
      const headerContainer =
        document.querySelector<HTMLElement>(".feed-header")!;
      initFeedHeader(headerContainer);

      const container = document.getElementById("followingContainer")!;
      container.innerHTML = `<p>Loading posts...</p>`;

      const currentUser = getUser();
      let currentUserFollowingNames: string[] = [];

      if (currentUser) {
        const profile = await getCachedProfile(currentUser.name);
        currentUserFollowingNames =
          profile.following?.map((f: Profile) => f.name) || [];
      }

      await initPaginatedList({
        container,
        loadMoreContainer: document.getElementById("loadMoreContainer")!,
        fetchItems: (page) => getPaginatedFollowingPosts(page, 10),
        renderItem: (post) => postCard(post, currentUserFollowingNames),
        isPostList: true,
      });

      const feedLink = document.getElementById("feedLink");
      feedLink?.addEventListener("click", (e) => {
        e.preventDefault();
        goTo("/feed");
      });
    },
  });
}
