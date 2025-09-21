import { protectedView } from "../utils/protectedView";
import {
  getProfileFollowing,
  getCurrentUserProfile,
} from "../services/profileService";
import { profileListItem } from "../components/profileListItem";
import { initFollowButtons } from "../components/followButton";
import { router } from "../app";
import { getUser } from "../store/userStore";

export function profileFollowingView(username?: string) {
  return protectedView({
    html: `
      <header>
        <button id="backBtn">← Back</button>
        <h2>Following</h2>
      </header>
      <div id="followingContainer"></div>
    `,
    init: async () => {
      const container = document.getElementById("followingContainer")!;
      const backBtn = document.getElementById("backBtn")!;

      backBtn.addEventListener("click", () =>
        router.navigate(`/profile/${username}`)
      );

      if (!username) {
        const currentUser = getUser();
        if (!currentUser) {
          container.innerHTML = `<p>No profile specified</p>`;
          return;
        }
        username = currentUser.name;
      }

      container.innerHTML = `<p>Loading following...</p>`;

      try {
        const following = await getProfileFollowing(username);

        const currentUser = getUser();
        let currentUserFollowingNames: string[] = [];

        if (currentUser) {
          const currentUserProfile = await getCurrentUserProfile(
            currentUser.name
          );
          currentUserFollowingNames =
            currentUserProfile.following?.map((f) => f.name) || [];
        }

        if (following.length === 0) {
          container.innerHTML = `<p>Not following anyone yet.</p>`;
        } else {
          container.innerHTML = following
            .map((profile) =>
              profileListItem(
                profile,
                currentUserFollowingNames.includes(profile.name)
              )
            )
            .join("");
        }

        initFollowButtons();

        container.addEventListener("click", (e) => {
          const target = (e.target as HTMLElement).closest(
            ".profile-link"
          ) as HTMLElement | null;
          if (target?.dataset.username) {
            router.navigate(`/profile/${target.dataset.username}`);
          }
        });
      } catch (error) {
        container.innerHTML = `<p>Error loading following.</p>`;
        console.error(error);
      }
    },
  });
}
