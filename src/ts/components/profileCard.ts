import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { getUser } from "../store/userStore";
import { openEditProfileModal } from "./modals/editProfileModal";

export function profileCard(
  profile: Profile,
  isFollowing: boolean,
): HTMLElement {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  const section = document.createElement("section");
  section.className = "profile-card relative";
  section.dataset.username = profile.name;

  const backBtn = document.createElement("button");
  backBtn.id = "profileBackBtn";
  backBtn.className =
    "font-semibold text-white text-xl flex items-center gap-2 absolute top-4 left-4 rounded-full p-1 bg-black/50";

  const backIcon = document.createElement("span");
  backIcon.className = "material-symbols-outlined";
  backIcon.textContent = "arrow_left_alt";

  backBtn.appendChild(backIcon);

  backBtn.addEventListener("click", () => history.back());

  let bannerEl: HTMLElement | null = null;

  if (profile.banner) {
    bannerEl = document.createElement("figure");
    bannerEl.className = "profile-banner w-full max-h-[150px] overflow-hidden";

    const img = document.createElement("img");
    img.src = profile.banner.url;
    img.alt = profile.banner.alt || "Banner";
    img.className = "w-full h-auto object-cover";

    bannerEl.appendChild(img);
  }

  const avatarFigure = document.createElement("figure");
  avatarFigure.className = "w-[90px] h-[90px] absolute top-[104px] left-[10px]";

  const avatarImg = document.createElement("img");
  avatarImg.className =
    "rounded-full border-2 border-white w-full h-full object-cover";
  avatarImg.src = profile.avatar?.url || "/default-avatar.png";
  avatarImg.alt = profile.avatar?.alt || profile.name;

  avatarFigure.appendChild(avatarImg);

  const actionWrapper = document.createElement("div");
  actionWrapper.className = "flex justify-end";

  let actionButton: HTMLElement;

  if (isOwnProfile) {
    actionButton = document.createElement("button");
    actionButton.id = "editProfileBtn";
    actionButton.className =
      "bg-secondary hover:bg-secondary-hover text-white text-sm py-2 px-4 rounded-full";
    actionButton.textContent = "Edit Profile";

    actionButton.addEventListener("click", () => {
      openEditProfileModal();
    });
  } else {
    actionButton = followButton(profile, isFollowing);
  }

  actionWrapper.appendChild(actionButton);

  // Header info
  const nameEl = document.createElement("h3");
  nameEl.className = "text-2xl font-extrabold";
  nameEl.textContent = profile.name;

  const emailEl = document.createElement("p");
  emailEl.className = "text-sm font-light";
  emailEl.textContent = profile.email;

  const bioEl = document.createElement("p");
  bioEl.textContent = profile.bio || "No bio written yet.";

  // Stats
  const statsWrapper = document.createElement("div");
  statsWrapper.className = "flex gap-4 text-sm";

  const posts = document.createElement("p");
  posts.textContent = `Posts: ${profile._count?.posts ?? 0}`;

  const followers = document.createElement("p");
  followers.className = "followers-link hover:text-primary-hover";
  followers.dataset.username = profile.name;
  followers.textContent = `Followers: ${profile._count?.followers ?? 0}`;

  const following = document.createElement("p");
  following.className = "following-link hover:text-primary-hover";
  following.dataset.username = profile.name;
  following.textContent = `Following: ${profile._count?.following ?? 0}`;

  statsWrapper.append(posts, followers, following);

  // Text container
  const textContainer = document.createElement("div");
  textContainer.className = "flex flex-col gap-2";

  const headerContainer = document.createElement("div");
  headerContainer.className = "flex flex-col";
  headerContainer.append(nameEl, emailEl);

  textContainer.append(headerContainer, bioEl, statsWrapper);

  // Main content wrapper
  const content = document.createElement("div");
  content.className = "flex flex-col p-4";

  content.append(actionWrapper, textContainer);

  // Assemble section
  section.appendChild(backBtn);

  if (bannerEl) section.appendChild(bannerEl);

  section.appendChild(avatarFigure);
  section.appendChild(content);

  const hr = document.createElement("hr");
  hr.className = "h-[px] bg-gray-medium border-none";

  const container = document.createElement("div");
  container.id = "profileHeader";
  container.append(section, hr);

  return container;
}
