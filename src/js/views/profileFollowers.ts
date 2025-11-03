import { protectedView } from "../utils/protectedView";
import {
  getProfileFollowers,
  getCurrentUserProfile,
} from "../services/profileService";
import { profileListItem } from "../components/profileListItem";
import { initFollowButtons } from "../components/followButton";
import { getUser } from "../store/userStore";
import { getCachedProfile } from "../utils/profileCache";
import { initProfileLinks } from "../utils/initProfileLinks";
import { goTo } from "../utils/navigate";

export function profileFollowersView(username?: string) {
  return protectedView({
    html: `
    <header class="flex items-center gap-2 pt-8 pb-2">
      <button id="backBtn" class="font-semibold text-xl flex items-center gap-2">
      <span class="material-symbols-outlined">arrow_left_alt</span>
      Followers</button>
    </header>
      <section id="followersContainer"></section>
    `,
    init: async () => {
      const container = document.getElementById("followersContainer")!;
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

      container.innerHTML = `<p>Loading followers...</p>`;

      try {
        const followers = await getProfileFollowers(username);

        const currentUser = getUser();
        let currentUserFollowingNames: string[] = [];

        if (currentUser) {
          try {
            const currentUserProfile = await getCurrentUserProfile(
              currentUser.name,
            );
            currentUserFollowingNames =
              currentUserProfile.following?.map((f) => f.name) || [];
          } catch (error) {
            let message = "Failed to fetch current user profile";
            if (error instanceof Error) message += `: ${error.message}`;
            console.error(message, error);
          }
        }

        if (followers.length === 0) {
          container.innerHTML = `<p>No followers yet.</p>`;
        } else {
          const profilesHtml = await Promise.all(
            followers.map(async (profile) => {
              const cachedProfile = await getCachedProfile(profile.name);
              return profileListItem(
                cachedProfile,
                currentUserFollowingNames.includes(cachedProfile.name),
              );
            }),
          );
          container.innerHTML = profilesHtml.join("");
        }

        initFollowButtons();
        initProfileLinks(container);
      } catch (error) {
        let message = "Error loading followers";
        if (error instanceof Error) message += `: ${error.message}`;
        container.innerHTML = `<p>${message}</p>`;
        console.error("profileFollowersView init error:", error);
      }
    },
  });
}
