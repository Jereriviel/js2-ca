import { getProfile, getProfilePosts } from "../services/profileService";
import { protectedView } from "../utils/protectedView";
import { postCard } from "../components/postCard";
import { router } from "../app";
import { getUser } from "../store/userStore";

export function profileView(username?: string) {
  return protectedView({
    html: `
      <div id="profileContainer"></div>
      <div id="profilePosts"></div>
    `,
    init: async () => {
      const profileContainer = document.getElementById("profileContainer")!;
      const postsContainer = document.getElementById("profilePosts")!;

      if (!username) {
        const currentUser = getUser();
        if (!currentUser) {
          profileContainer.innerHTML = `<p>No profile specified</p>`;
          return;
        }
        username = currentUser.name;
      }

      try {
        const profile = await getProfile(username);
        profileContainer.innerHTML = `
          <h1>${profile.name}</h1>
          <p>${profile.bio ?? ""}</p>
          ${
            profile.avatar
              ? `<img src="${profile.avatar.url}" alt="${profile.avatar.alt}" />`
              : ""
          }
          <p>Followers: ${profile._count.followers}</p>
          <p>Following: ${profile._count.following}</p>
        `;

        const posts = await getProfilePosts(username);
        postsContainer.innerHTML =
          posts.length > 0
            ? posts.map(postCard).join("")
            : "<p>No posts yet.</p>";

        const profileLinks =
          postsContainer.querySelectorAll<HTMLElement>(".profile-link");
        profileLinks.forEach((link) => {
          const uname = link.dataset.username;
          if (uname) {
            link.addEventListener("click", () => {
              router.navigate(`/profile/${uname}`);
            });
          }
        });
      } catch (error) {
        profileContainer.innerHTML = `<p>Error loading profile</p>`;
      }
    },
  });
}
