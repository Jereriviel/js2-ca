import { protectedView } from "../utils/protectedView";
import {
  getProfileFollowing,
  getCurrentUserProfile,
} from "../services/profileService";
import { profileListItem } from "../components/profileListItem";
import { initFollowButtons } from "../components/followButton";
import { getUser } from "../store/userStore";
import { getCachedProfile } from "../utils/profileCache";
import { initProfileLinks } from "../utils/initProfileLinks";
import { goTo } from "../utils/navigate";

export function profileFollowingView(username?: string) {
  return protectedView({
    html: `
    <header class="flex items-center gap-2 pt-8 pb-2">
      <button id="backBtn" class="font-semibold text-xl flex items-center gap-2">
      <span class="material-symbols-outlined">arrow_left_alt</span>
      Following</button>
    </header>
      <section id="followingContainer"></section>
    `,
    init: async () => {
      const container = document.getElementById("followingContainer")!;
      const backBtn = document.getElementById("backBtn")!;

      backBtn.addEventListener("click", () => goTo(`/profile/${username}`));

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
          const profilesHtml = await Promise.all(
            following.map(async (profile) => {
              const cachedProfile = await getCachedProfile(profile.name);
              return profileListItem(
                cachedProfile,
                currentUserFollowingNames.includes(cachedProfile.name)
              );
            })
          );
          container.innerHTML = profilesHtml.join("");
        }

        initFollowButtons();
        initProfileLinks(container);
      } catch (error) {
        container.innerHTML = `<p>Error loading following.</p>`;
        console.error(error);
      }
    },
  });
}
