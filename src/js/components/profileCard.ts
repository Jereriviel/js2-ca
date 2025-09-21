import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { profileAvatar } from "../utils/profileAvatar";
import { getUser } from "../store/userStore";
import { openEditProfileModal } from "./editProfileModal";

export function profileCard(profile: Profile, isFollowing: boolean): string {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  const actionButton = isOwnProfile
    ? `<button id="editProfileBtn">Edit Profile</button>`
    : followButton(profile, isFollowing);

  const bannerHtml = profile.banner
    ? `<div class="profile-banner">
         <img src="${profile.banner.url}" alt="${
        profile.banner.alt || "Banner"
      }" />
       </div>`
    : "";

  return `
    <div class="profile-card" data-username="${profile.name}">
      ${bannerHtml}
      ${profileAvatar(profile, "regular")}
      <div>
        <h3>${profile.name}</h3>
        <p>${profile.bio || "No bio available."}</p>
        <p>
          Posts: ${profile._count?.posts ?? 0} | 
          Followers: ${profile._count?.followers ?? 0} | 
          Following: ${profile._count?.following ?? 0}
        </p>
        ${actionButton}
      </div>
    </div>
  `;
}

export function initProfileCard() {
  const editBtn = document.getElementById("editProfileBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openEditProfileModal();
    });
  }
}
