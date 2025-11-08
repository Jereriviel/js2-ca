import { protectedView } from "../utils/protectedView";
import { profileCard, initProfileCard } from "../components/profileCard";
import { postCard } from "../components/postCard";
import { getCurrentUserProfile } from "../services/profileService";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";
import type { Post } from "../types/post";
import { getPaginatedProfilePosts } from "../services/postsService";
import { initPaginatedList } from "../utils/initialization/initPaginatedList";
import { goTo } from "../utils/navigate";
import { footer } from "../components/footer";
import { profileHeader } from "../components/headers/profileHeader";
import { profileCardSkeleton } from "../components/loadingSkeletons";
import { postCardSkeleton } from "../components/loadingSkeletons";
import { showErrorModal } from "../components/modals/errorModal";

export function profileView(username?: string | number) {
  return protectedView({
    header: profileHeader(),
    footer: footer(),
    html: `
      <section id="profilePosts"></section>
      <div id="loadMoreContainer" class="load-more-container flex justify-center py-8"></div>
    `,
    init: async () => {
      const header = document.getElementById("profileHeader")!;
      const postsContainer = document.getElementById("profilePosts")!;
      const loadMoreContainer = document.getElementById("loadMoreContainer")!;

      header.innerHTML = profileCardSkeleton();

      if (!username) {
        const currentUser = getUser();
        if (!currentUser) {
          header.innerHTML = `<p>No profile specified</p>`;
          return;
        }
        username = currentUser.name;
      }

      try {
        const profile: Profile = await getCachedProfile(username);
        const currentUser = getUser();
        let loggedInUserFollowing: string[] = [];

        if (currentUser) {
          try {
            const currentUserProfile = await getCurrentUserProfile(
              currentUser.name,
            );
            loggedInUserFollowing =
              currentUserProfile.following?.map((f) => f.name) || [];
          } catch (error) {
            let message = "Failed to fetch current user profile";
            if (error instanceof Error) message += `: ${error.message}`;
            console.error(message, error);
          }
        }

        const isFollowingProfile = loggedInUserFollowing.includes(profile.name);
        header.innerHTML = profileCard(profile, isFollowingProfile);

        initProfileCard();

        header.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const username = target.dataset.username;
          if (!username) return;

          if (target.classList.contains("followers-link")) {
            goTo(`/profile/${username}/followers`);
          }
          if (target.classList.contains("following-link")) {
            goTo(`/profile/${username}/following`);
          }
        });

        postsContainer.innerHTML = Array.from({ length: 10 })
          .map(() => postCardSkeleton())
          .join("");

        await initPaginatedList<Post>({
          container: postsContainer,
          loadMoreContainer,
          fetchItems: (page) => getPaginatedProfilePosts(username!, page, 5),
          renderItem: (post) =>
            postCard(post, loggedInUserFollowing, { lazy: true }),
          isPostList: true,
        });
      } catch (error) {
        let message = "Error loading profile";
        if (error instanceof Error) message += `: ${error.message}`;
        await showErrorModal(message);
        postsContainer.innerHTML = "";
        console.error("profileView init error:", error);
      }
    },
  });
}
