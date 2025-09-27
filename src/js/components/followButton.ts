import { followProfile, unfollowProfile } from "../services/profileService";
import type { Profile } from "../types/profile";

export function followButton(profile: Profile, isFollowing: boolean): string {
  return `
    <button 
      class="follow-btn bg-secondary hover:bg-secondary-hover text-white text-sm py-4 px-4 rounded-full" 
      data-username="${profile.name}" 
      data-following="${isFollowing}"
    >
      ${isFollowing ? "Unfollow" : "Follow"}
    </button>
  `;
}

export function initFollowButtons() {
  document.querySelectorAll<HTMLButtonElement>(".follow-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const username = btn.dataset.username!;
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
      } catch (err) {
        console.error("Follow/Unfollow failed:", err);
      }
    });
  });
}
