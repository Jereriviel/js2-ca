import type { Profile } from "../types/profile";
import { followButton } from "./followButton";

export function profileCard(profile: Profile, isFollowing: boolean): string {
  return `
    <div class="profile-card" data-username="${profile.name}">
      <img src="${profile.avatar?.url || "/default-avatar.png"}" 
           alt="${profile.avatar?.alt || profile.name}" 
           width="80" height="80"/>
      <div>
        <h3>${profile.name}</h3>
        <p>${profile.bio || "No bio available."}</p>
        <p>
          Posts: ${profile._count?.posts ?? 0} | 
          Followers: ${profile._count?.followers ?? 0} | 
          Following: ${profile._count?.following ?? 0}
        </p>
        ${followButton(profile, isFollowing)}
      </div>
    </div>
  `;
}
