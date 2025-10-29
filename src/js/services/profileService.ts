import { get, put } from "./apiService";
import { handleError } from "../errors/handleError";
import type { Profile, ProfileResponse } from "../types/profile";
import type { Post, PostsResponse } from "../types/post";

export async function getProfile(name: string | number): Promise<Profile> {
  try {
    const response = await get<ProfileResponse>(
      `/social/profiles/${name}?_followers=true&_following=true`,
    );
    if (!response) throw new Error("No response received from server.");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getProfilePosts(name: string): Promise<Post[]> {
  try {
    const response = await get<PostsResponse>(
      `/social/profiles/${name}/posts?_author=true&_comments=true&_reactions=true&_followers=true`,
    );
    if (!response) throw new Error("No response received from server.");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getCurrentUserProfile(name: string): Promise<Profile> {
  try {
    const response = await get<ProfileResponse>(
      `/social/profiles/${name}?_following=true`,
    );
    if (!response) throw new Error("No response received from server.");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updateProfile(
  name: string,
  updates: Partial<Profile>,
): Promise<Profile> {
  try {
    const response = await put<ProfileResponse>(
      `/social/profiles/${name}`,
      updates,
    );
    if (!response) throw new Error("Failed to update profile.");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function followProfile(name: string): Promise<void> {
  try {
    await put(`/social/profiles/${name}/follow`);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function unfollowProfile(name: string): Promise<void> {
  try {
    await put(`/social/profiles/${name}/unfollow`);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getProfileFollowers(
  username: string,
): Promise<Profile[]> {
  try {
    const response = await get<ProfileResponse>(
      `/social/profiles/${username}?_followers=true`,
    );
    if (!response) throw new Error("No response received from server.");
    return response.data.followers || [];
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getProfileFollowing(
  username: string,
): Promise<Profile[]> {
  try {
    const response = await get<ProfileResponse>(
      `/social/profiles/${username}?_following=true`,
    );
    if (!response) throw new Error("No response received from server.");
    return response.data.following || [];
  } catch (error) {
    handleError(error);
    throw error;
  }
}
