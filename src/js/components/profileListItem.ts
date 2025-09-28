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
    <div class="profile-list-item flex justify-between items-start py-4">
      <div class="flex flex-col gap-2">
        <div class="profile-link flex gap-2" data-username="${profile.name}">
          <figure class="w-12 h-12">
            <img class="rounded-full w-full h-full object-cover"
            src="${profile.avatar?.url || "/default-avatar.png"}"
            alt="${profile.avatar?.alt || profile.name}" />
          </figure>
          <h4 class="font-semibold">${profile.name}</h4>
        </div>
        <div>
          <p>${profile.bio || ""}</p>
        </div>
      </div>
      ${isOwnProfile ? "" : followButton(profile, isFollowing)}
    </div>
    <hr class="h-[1px] bg-gray-medium border-none">
  `;
}
