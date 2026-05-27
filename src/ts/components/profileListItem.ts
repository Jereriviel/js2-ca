import type { Profile } from "../types/profile";
import { followButton } from "./followButton";
import { getUser } from "../store/userStore";

export function profileListItem(
  profile: Profile,
  isFollowing: boolean,
): HTMLElement {
  const loggedInUser = getUser();
  const isOwnProfile = loggedInUser?.name === profile.name;

  const wrapper = document.createElement("div");

  const item = document.createElement("div");
  item.className = "profile-list-item flex justify-between items-start py-4";

  const left = document.createElement("div");
  left.className = "flex flex-col gap-2";

  const profileLink = document.createElement("div");
  profileLink.className = "profile-link flex gap-2";
  profileLink.dataset.username = profile.name;

  const figure = document.createElement("figure");
  figure.className = "w-12 h-12";

  const img = document.createElement("img");
  img.className = "rounded-full w-full h-full object-cover";
  img.src = profile.avatar?.url || "/default-avatar.png";
  img.alt = profile.avatar?.alt || profile.name;

  const name = document.createElement("h4");
  name.className = "font-semibold";
  name.textContent = profile.name;

  figure.append(img);
  profileLink.append(figure, name);

  const bioWrapper = document.createElement("div");

  const bio = document.createElement("p");
  bio.textContent = profile.bio || "";

  bioWrapper.append(bio);

  left.append(profileLink, bioWrapper);

  item.append(left);

  if (!isOwnProfile) {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.append(followButton(profile, isFollowing));
    item.append(buttonWrapper);
  }

  const divider = document.createElement("hr");
  divider.className = "text-gray-medium mb-4";

  wrapper.append(item, divider);

  return wrapper;
}
