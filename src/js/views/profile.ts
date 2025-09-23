import { protectedView } from "../utils/protectedView";
import { profileCard } from "../components/profileCard";
import { postCard } from "../components/postCard";
import { getCurrentUserProfile } from "../services/profileService";
import { getCachedProfile } from "../utils/profileCache";
import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";
import type { Post } from "../types/post";
import { getPaginatedProfilePosts } from "../services/postsService";
import { initPaginatedList } from "../utils/initPaginatedList";
import { goTo } from "../utils/navigate";

export function profileView(username?: string) {
  return protectedView({
    html: `
      <h1>Profile</h1>
      <div id="profileHeader"></div>
      <div id="profilePosts"></div>
      <div id="loadMoreContainer" class="load-more-container"></div>
    `,
    init: async () => {
      const header = document.getElementById("profileHeader")!;
      const postsContainer = document.getElementById("profilePosts")!;
      const loadMoreContainer = document.getElementById("loadMoreContainer")!;

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
          const currentUserProfile = await getCurrentUserProfile(
            currentUser.name
          );
          loggedInUserFollowing =
            currentUserProfile.following?.map((f) => f.name) || [];
        }

        const isFollowingProfile = loggedInUserFollowing.includes(profile.name);
        header.innerHTML = profileCard(profile, isFollowingProfile);

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
          fetchItems: (page) => getPaginatedProfilePosts(username!, page, 5),
          renderItem: (post) => postCard(post, loggedInUserFollowing),
          isPostList: true,
        });
      } catch (error) {
        header.innerHTML = `<p>Error loading profile.</p>`;
        postsContainer.innerHTML = "";
        console.error(error);
      }
    },
  });
}
