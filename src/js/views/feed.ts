import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import { getPaginatedPosts } from "../services/postsService";
import type { Profile } from "../types/profile";
import { initPaginatedList } from "../utils/initPaginatedList";
import { feedHeader, initFeedHeader } from "../components/feedHeader";
import { goTo } from "../utils/navigate";

export function feedView() {
  return protectedView({
    html: `
      ${feedHeader("feed")}
      <div id="feedContainer"></div>
      <div id="loadMoreContainer" class="load-more-container"></div>
    `,
    init: async () => {
      const headerContainer =
        document.querySelector<HTMLElement>(".feed-header")!;
      initFeedHeader(headerContainer);

      const container = document.getElementById("feedContainer")!;
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
        fetchItems: (page) => getPaginatedPosts(page, 10),
        renderItem: (post) => postCard(post, currentUserFollowingNames),
        isPostList: true,
      });

      const followingLink = document.getElementById("followingLink");
      followingLink?.addEventListener("click", (e) => {
        e.preventDefault();
        goTo("/feed/following");
      });
    },
  });
}
