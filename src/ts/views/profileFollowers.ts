import { protectedView } from "../utils/protectedView";
import {
  getProfileFollowers,
  getCurrentUserProfile,
} from "../services/profileService";
import { profileListItem } from "../components/profileListItem";
import { initFollowButtons } from "../components/followButton";
import { getUser } from "../store/userStore";
import { getCachedProfile } from "../utils/profileCache";
import { initProfileLinks } from "../utils/initialization/initProfileLinks";
import { goTo } from "../utils/navigate";
import { footer } from "../components/footer";
import { backHeader } from "../components/headers/backHeader";
import { profileListSkeleton } from "../components/loadingSkeletons";
import { showErrorModal } from "../components/modals/errorModal";
import { handleError } from "../errors/handleError";

export function profileFollowersView(username?: string) {
  return protectedView({
    header: backHeader(),
    footer: footer(),
    html: `
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

      container.innerHTML = Array.from({ length: 5 })
        .map(() => profileListSkeleton())
        .join("");

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
            await showErrorModal(handleError(error));
          }
        }

        if (followers.length === 0) {
          container.innerHTML = `<p>No followers yet.</p>`;
        } else {
          const profileElements = await Promise.all(
            followers.map(async (profile) => {
              const cachedProfile = await getCachedProfile(profile.name);

              return profileListItem(
                cachedProfile,
                currentUserFollowingNames.includes(cachedProfile.name),
              );
            }),
          );

          container.replaceChildren(...profileElements);
        }

        initFollowButtons();
        initProfileLinks(container);
      } catch (error) {
        await showErrorModal(handleError(error));
        container.innerHTML = `<p>Failed to load followers</p>`;
      }
    },
  });
}
