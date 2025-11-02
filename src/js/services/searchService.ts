import { get } from "./apiService";
import { handleError } from "../errors/handleError";
import type { Profile } from "../types/profile";
import type { PaginatedResponse, Post } from "../types/post";

interface SearchPostsResponse {
  data: Post[];
  meta: {
    count: number;
  };
}

interface SearchProfilesResponse {
  data: Profile[];
  meta: {
    count: number;
  };
}

export async function searchPosts(query: string): Promise<SearchPostsResponse> {
  try {
    const response = await get<SearchPostsResponse>(
      `/social/posts/search?q=${encodeURIComponent(query)}&_author=true`,
    );
    if (!response) throw new Error("No response received from searchPosts.");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function searchProfiles(
  query: string,
): Promise<SearchProfilesResponse> {
  try {
    const response = await get<SearchProfilesResponse>(
      `/social/profiles/search?q=${encodeURIComponent(query)}`,
    );
    if (!response) throw new Error("No response received from searchProfiles.");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPaginatedSearchPosts(
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Post>> {
  try {
    const response = await get<PaginatedResponse<Post>>(
      `/social/posts/search?q=${encodeURIComponent(
        query,
      )}&_author=true&page=${page}&limit=${limit}`,
    );
    if (!response)
      throw new Error("No response received from getPaginatedSearchPosts.");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPaginatedSearchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Profile>> {
  try {
    const response = await get<PaginatedResponse<Profile>>(
      `/social/profiles/search?q=${encodeURIComponent(
        query,
      )}&page=${page}&limit=${limit}`,
    );
    if (!response)
      throw new Error("No response received from getPaginatedSearchProfiles.");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}
