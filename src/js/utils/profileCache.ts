import type { Profile } from "../types/profile";
import { getProfile } from "../services/profileService";

const cache: Record<string, Profile> = {};

export async function getCachedProfile(username: string): Promise<Profile> {
  if (cache[username]) {
    return cache[username];
  }

  const profile = await getProfile(username);
  cache[username] = profile;
  return profile;
}
