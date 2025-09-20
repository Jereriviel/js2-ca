import {
  getProfile,
  getProfilePosts,
  getCurrentUserProfile,
} from "../services/profileService";
import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { profileCard } from "../components/profileCard";
import { initFollowButtons } from "../components/followButton";
import { router } from "../app";
import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";
import type { Post } from "../types/post";
import { createLoadMoreButton } from "../components/loadMoreButton";
import { getPaginatedProfilePosts } from "../services/postsService";
import { initProfileCard } from "../components/profileCard";

export function profileView(username?: string) {
  return protectedView({
    html: `
      <h1>Profile</h1>
      <div id="profileHeader"></div>
      <div id="profilePosts"></div>
      <div id="loadMoreContainer"></div>
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
        const profile: Profile = await getProfile(username);
        const posts: Post[] = await getProfilePosts(username);

        let loggedInUserFollowing: string[] = [];
        const currentUser = getUser();
        if (currentUser) {
          const currentUserProfile = await getCurrentUserProfile(
            currentUser.name
          );
          loggedInUserFollowing =
            currentUserProfile.following?.map((f) => f.name) || [];
        }

        const isFollowingProfile = loggedInUserFollowing.includes(profile.name);
        header.innerHTML = profileCard(profile, isFollowingProfile);

        if (posts.length === 0) {
          postsContainer.innerHTML = `<p>No posts yet.</p>`;
        } else {
          const postsHtml = await Promise.all(
            posts.map((post) => postCard(post, loggedInUserFollowing))
          );
          postsContainer.innerHTML = postsHtml.join("");
        }

        postsContainer.addEventListener("click", (e) => {
          const target = (e.target as HTMLElement).closest(
            ".profile-link"
          ) as HTMLElement | null;
          if (target?.dataset.username) {
            router.navigate(`/profile/${target.dataset.username}`);
          }
        });

        postsContainer
          .querySelectorAll<HTMLElement>(".post-link")
          .forEach((el) => {
            const postId = el.dataset.id;
            if (postId) {
              el.addEventListener("click", () => {
                router.navigate(`/post/${postId}`);
              });
            }
          });

        initFollowButtons();
        initProfileCard();

        const loadMoreBtn = createLoadMoreButton({
          container: postsContainer,
          fetchItems: async (page: number) =>
            await getPaginatedProfilePosts(username!, page, 5),
          renderItem: (post) => postCard(post, loggedInUserFollowing),
          onAfterRender: () => initFollowButtons(),
        });
        loadMoreContainer.appendChild(loadMoreBtn);
      } catch (error) {
        header.innerHTML = `<p>Error loading profile.</p>`;
        postsContainer.innerHTML = "";
        console.error(error);
      }
    },
  });
}
