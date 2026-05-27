import { protectedView } from "../utils/protectedView";
import { profileCard } from "../components/profileCard";
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
import {
  profileCardSkeleton,
  postCardSkeleton,
} from "../components/loadingSkeletons";
import { showErrorModal } from "../components/modals/errorModal";
import { handleError } from "../errors/handleError";

export function profileView(username?: string) {
  return protectedView({
    header: "",
    footer: footer(),
    html: `
      <section id="profileHeader" class="px-4 sm:px-8"></section>
      <section id="profilePosts" class="px-4 sm:px-8"></section>
      <div id="loadMoreContainer" class="load-more-container flex justify-center py-4 sm:py-8"></div>
    `,
    init: async () => {
      const header = document.getElementById("profileHeader")!;
      const postsContainer = document.getElementById("profilePosts")!;
      const loadMoreContainer = document.getElementById("loadMoreContainer")!;

      const currentUser = getUser();
      const resolvedUsername = username ?? currentUser?.name;

      if (!resolvedUsername) {
        header.textContent = "No profile specified";
        return;
      }

      header.innerHTML = profileCardSkeleton();
      postsContainer.innerHTML = Array.from({ length: 10 })
        .map(() => postCardSkeleton())
        .join("");

      try {
        const profile: Profile = await getCachedProfile(resolvedUsername);

        let loggedInUserFollowing: string[] = [];

        if (currentUser) {
          try {
            const currentUserProfile = await getCurrentUserProfile(
              currentUser.name,
            );

            loggedInUserFollowing =
              currentUserProfile.following?.map((f) => f.name) || [];
          } catch (error) {
            await showErrorModal(handleError(error));
          }
        }

        const isFollowingProfile = loggedInUserFollowing.includes(profile.name);

        header.replaceChildren(profileCard(profile, isFollowingProfile));

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

        await initPaginatedList<Post>({
          container: postsContainer,
          loadMoreContainer,
          fetchItems: (page) =>
            getPaginatedProfilePosts(resolvedUsername, page, 5),
          renderItem: (post) =>
            postCard(post, loggedInUserFollowing, { lazy: true }),
          isPostList: true,
        });
      } catch (error) {
        await showErrorModal(handleError(error));
        postsContainer.replaceChildren();
      }
    },
  });
}
