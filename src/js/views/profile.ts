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

export function profileView(username?: string) {
  return protectedView({
    html: `
      <h1>Profile</h1>
      <div id="profileHeader"></div>
      <div id="profilePosts"></div>
    `,
    init: async () => {
      const header = document.getElementById("profileHeader")!;
      const postsContainer = document.getElementById("profilePosts")!;

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

        initFollowButtons();

        postsContainer
          .querySelectorAll<HTMLElement>(".profile-link")
          .forEach((link) => {
            const username = link.dataset.username;
            if (username) {
              link.addEventListener("click", () => {
                router.navigate(`/profile/${username}`);
              });
            }
          });
      } catch (error) {
        header.innerHTML = `<p>Error loading profile.</p>`;
        postsContainer.innerHTML = "";
        console.error(error);
      }
    },
  });
}
