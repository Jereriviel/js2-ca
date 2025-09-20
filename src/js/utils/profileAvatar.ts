import type { Profile } from "../types/profile";

export function profileAvatar(
  profile: Profile,
  size: "mini" | "regular" = "regular"
): string {
  const dimension = size === "mini" ? 40 : 80;

  return `
    <div class="profile-avatar ${size}" data-username="${profile.name}">
      <img src="${profile.avatar?.url || "/default-avatar.png"}"
           alt="${profile.avatar?.alt || profile.name}"
           width="${dimension}" height="${dimension}" />
    </div>
  `;
}
