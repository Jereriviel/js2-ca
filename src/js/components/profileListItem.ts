import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { getUser } from "../store/userStore";

export function profileListItem(
  profile: Profile,
  isFollowing: boolean
): string {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  return `
    <div class="profile-list-item">
      <div class="profile-link" data-username="${profile.name}">
        <img 
          class="rounded-full" 
          src="${profile.avatar?.url || "/default-avatar.png"}" 
          alt="${profile.avatar?.alt || profile.name}" 
        />
        <h4>${profile.name}</h4>
      </div>

      <div>
        <p>${profile.bio || ""}</p>
        ${isOwnProfile ? "" : followButton(profile, isFollowing)}
      </div>
    </div>
  `;
}
