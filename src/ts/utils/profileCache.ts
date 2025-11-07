import type { Profile } from "../types/profile";
import { get } from "../services/apiService";

const profileCache: Record<string, Profile> = {};
const inflight: Record<string, Promise<Profile> | undefined> = {};

export async function getCachedProfile(username: string): Promise<Profile> {
  if (profileCache[username]) return profileCache[username];

  if (inflight[username]) return inflight[username]!;

  inflight[username] = (async () => {
    const response = await get<{ data: Profile }>(
      `/social/profiles/${username}?_following=true`,
    );
    const profile = response?.data;
    if (!profile) throw new Error("No profile returned from API");

    profileCache[username] = profile;
    delete inflight[username];

    return profile;
  })();

  return inflight[username]!;
}
