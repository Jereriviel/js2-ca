import { profileCard } from "../profileCard";
import type { Profile } from "../../types/profile";

export function profileHeader(
  profile: Profile,
  isFollowing: boolean,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.id = "profileHeader";

  wrapper.appendChild(profileCard(profile, isFollowing));

  return wrapper;
}
