import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import { getPaginatedFollowingPosts } from "../services/postsService";
import type { Profile } from "../types/profile";
import { initPaginatedList } from "../utils/initialization/initPaginatedList";
import { feedHeader, initFeedHeader } from "../components/headers/feedHeader";
import { goTo } from "../utils/navigate";
import { footer } from "../components/footer";
import { postCardSkeleton } from "../components/loadingSkeletons";

export function followingView() {
  return protectedView({
    header: feedHeader("following"),
    footer: footer(),
    html: `
      <section id="followingContainer"></section>
      <section id="loadMoreContainer" class="load-more-container flex justify-center py-4 sm:py-8"></section>
    `,
    init: async () => {
      const headerContainer =
        document.querySelector<HTMLElement>(".feed-header")!;
      initFeedHeader(headerContainer);

      const container = document.getElementById("followingContainer")!;

      container.innerHTML = Array.from({ length: 10 })
        .map(() => postCardSkeleton())
        .join("");

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
        renderItem: (post) =>
          postCard(post, currentUserFollowingNames, { lazy: true }),
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
