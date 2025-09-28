import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import { getPaginatedFollowingPosts } from "../services/postsService";
import type { Profile } from "../types/profile";
import { initPaginatedList } from "../utils/initPaginatedList";
import { feedHeader, initFeedHeader } from "../components/feedHeader";
import { goTo } from "../utils/navigate";

export function followingView() {
  return protectedView({
    html: `
      ${feedHeader("following")}
      <section id="followingContainer"></section>
      <section id="loadMoreContainer" class="load-more-container flex justify-center pt-12"></section>
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
