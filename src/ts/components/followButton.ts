import { followProfile, unfollowProfile } from "../services/profileService";
import type { Profile } from "../types/profile";
import { showErrorModal } from "./modals/errorModal";
import { handleError } from "../errors/handleError";

export function followButton(
  profile: Profile,
  isFollowing: boolean,
): HTMLElement {
  const button = document.createElement("button");

  button.className =
    "follow-btn bg-secondary hover:bg-secondary-hover text-white text-sm py-1 px-4 rounded-full";

  button.dataset.username = profile.name;
  button.dataset.following = String(isFollowing);

  button.textContent = isFollowing ? "Unfollow" : "Follow";

  return button;
}

export function initFollowButtons() {
  document.querySelectorAll<HTMLButtonElement>(".follow-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.dataset.username;
      if (!username) return;

      const currentlyFollowing = btn.dataset.following === "true";

      try {
        if (currentlyFollowing) {
          await unfollowProfile(username);

          btn.textContent = "Follow";
          btn.dataset.following = "false";
        } else {
          await followProfile(username);

          btn.textContent = "Unfollow";
          btn.dataset.following = "true";
        }
      } catch (error) {
        await showErrorModal(handleError(error));
      }
    });
  });
}
