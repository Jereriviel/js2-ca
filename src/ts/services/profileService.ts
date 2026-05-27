import { get, put } from "./apiService";
import type { Profile, ProfileResponse } from "../types/profile";
import type { Post, PostsResponse } from "../types/post";

export async function getProfile(name: string | number): Promise<Profile> {
  const response = await get<ProfileResponse>(
    `/social/profiles/${name}?_followers=true&_following=true`,
  );
  if (!response) throw new Error("No response received from server.");
  return response.data;
}

export async function getProfilePosts(name: string): Promise<Post[]> {
  const response = await get<PostsResponse>(
    `/social/profiles/${name}/posts?_author=true&_comments=true&_reactions=true&_followers=true`,
  );
  if (!response) throw new Error("No response received from server.");
  return response.data;
}

const currentUserProfileCache: Record<string, Profile> = {};
const inflightRequests: Record<string, Promise<Profile> | undefined> = {};

export async function getCurrentUserProfile(
  username: string,
): Promise<Profile> {
  if (currentUserProfileCache[username]) {
    return currentUserProfileCache[username];
  }

  if (inflightRequests[username]) {
    return inflightRequests[username];
  }

  inflightRequests[username] = (async () => {
    const response = await get<{ data: Profile }>(
      `/social/profiles/${username}?_followers=true&_following=true`,
    );
    const profile = response?.data;
    if (!profile) throw new Error("No profile returned from API");

    currentUserProfileCache[username] = profile;
    delete inflightRequests[username];

    return profile;
  })();

  return inflightRequests[username];
}

export async function updateProfile(
  name: string,
  updates: Partial<Profile>,
): Promise<Profile> {
  const response = await put<ProfileResponse>(
    `/social/profiles/${name}`,
    updates,
  );
  if (!response) throw new Error("Failed to update profile.");
  return response.data;
}

export async function followProfile(name: string): Promise<void> {
  await put(`/social/profiles/${name}/follow`);
}

export async function unfollowProfile(name: string): Promise<void> {
  await put(`/social/profiles/${name}/unfollow`);
}

export async function getProfileFollowers(
  username: string,
): Promise<Profile[]> {
  const response = await get<ProfileResponse>(
    `/social/profiles/${username}?_followers=true`,
  );
  if (!response) throw new Error("No response received from server.");
  return response.data.followers || [];
}

export async function getProfileFollowing(
  username: string,
): Promise<Profile[]> {
  const response = await get<ProfileResponse>(
    `/social/profiles/${username}?_following=true`,
  );
  if (!response) throw new Error("No response received from server.");
  return response.data.following || [];
}
