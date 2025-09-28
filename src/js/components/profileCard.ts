import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { getUser } from "../store/userStore";
import { openEditProfileModal } from "./modals/editProfileModal";

export function profileCard(profile: Profile, isFollowing: boolean): string {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  const actionButton = isOwnProfile
    ? `<button id="editProfileBtn" class="bg-secondary hover:bg-secondary-hover text-white text-sm py-4 px-4 rounded-full">Edit Profile</button>`
    : followButton(profile, isFollowing);

  const bannerHtml = profile.banner
    ? `<figure class="profile-banner w-full max-h-[150px] overflow-hidden">
       <img 
         src="${profile.banner.url}"
         alt="${profile.banner.alt || "Banner"}"
         class="w-full h-auto object-cover"
       />
     </figure>`
    : "";

  return `
    <section class="profile-card relative" data-username="${profile.name}">

            <button id="profileBackBtn" class="font-semibold text-white text-xl flex items-center gap-2 absolute top-4 left-4 rounded-full p-1 bg-black/50">
              <span class="material-symbols-outlined">arrow_left_alt</span>
            </button>
      ${bannerHtml}
      <figure class="w-[90px] h-[90px] position: absolute top-[104px] left-[10px]">
      <img class="rounded-full border-2 border-white w-full h-full" src="${
        profile.avatar?.url || "/default-avatar.png"
      }"
           alt="${profile.avatar?.alt || profile.name}"/>
      </figure>
      <div class="flex flex-col py-4">
      <div class="flex justify-end">
      ${actionButton}
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-xl font-extrabold">${profile.name}</h3>
        <p>${profile.bio || "No bio written yet."}</p>
      <div class="flex gap-4 text-sm">
        <p>Posts: ${profile._count?.posts ?? 0}</p>
        <p class="followers-link hover:text-primary-hover" data-username="${
          profile.name
        }">
           Followers: ${profile._count?.followers ?? 0}
        </p>
        <p class="following-link hover:text-primary-hover" data-username="${
          profile.name
        }">
            Following: ${profile._count?.following ?? 0}
        </p>
      </div>
      </div>
      </div>
    </section>
    <hr class="h-[1px] bg-gray-medium border-none">
  `;
}

export function initProfileCard() {
  const editBtn = document.getElementById("editProfileBtn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openEditProfileModal();
    });
  }

  const backBtn = document.getElementById("profileBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => history.back());
  }
}
