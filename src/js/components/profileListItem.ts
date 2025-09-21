import type { Profile } from "../types/profile";
import { profileAvatar } from "../utils/profileAvatar";
import { followButton } from "./followButton";
import { getUser } from "../store/userStore";

export function profileListItem(
  profile: Profile,
  isFollowing: boolean
): string {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  return `
    <div class="profile-list-item" data-username="${profile.name}">
      ${profileAvatar(profile, "mini")}
      <div>
        <h4 class="profile-link" data-username="${profile.name}">${
    profile.name
  }</h4>
        <p>${profile.bio || ""}</p>
      </div>
      <div>
        ${isOwnProfile ? "" : followButton(profile, isFollowing)}
      </div>
    </div>
  `;
}
