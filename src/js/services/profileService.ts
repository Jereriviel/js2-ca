import { get, put } from "./apiService";
import type { Profile, ProfileResponse } from "../types/profile";
import type { Post, PostsResponse } from "../types/post";

export async function getProfile(name: string): Promise<Profile> {
  const response = await get<ProfileResponse>(
    `/social/profiles/${name}?_followers=true&_following=true`
  );
  return response.data;
}

export async function getProfilePosts(name: string): Promise<Post[]> {
  const response = await get<PostsResponse>(
    `/social/profiles/${name}/posts?_author=true&_comments=true&_reactions=true&?_followers=true`
  );
  return response.data;
}

export async function getCurrentUserProfile(name: string) {
  const response = await get<ProfileResponse>(
    `/social/profiles/${name}?_following=true`
  );
  return response.data;
}

export async function updateProfile(
  name: string,
  updates: Partial<Profile>
): Promise<Profile> {
  const response = await put<ProfileResponse>(
    `/social/profiles/${name}`,
    updates
  );
  return response.data;
}

export async function followProfile(name: string): Promise<void> {
  await put(`/social/profiles/${name}/follow`);
}

export async function unfollowProfile(name: string): Promise<void> {
  await put(`/social/profiles/${name}/unfollow`);
}
