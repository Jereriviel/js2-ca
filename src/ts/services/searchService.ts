import { get } from "./apiService";
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
  const response = await get<SearchPostsResponse>(
    `/social/posts/search?q=${encodeURIComponent(query)}&_author=true`,
  );
  if (!response) throw new Error("No response received from searchPosts.");
  return response;
}

export async function searchProfiles(
  query: string,
): Promise<SearchProfilesResponse> {
  const response = await get<SearchProfilesResponse>(
    `/social/profiles/search?q=${encodeURIComponent(query)}`,
  );
  if (!response) throw new Error("No response received from searchProfiles.");
  return response;
}

export async function getPaginatedSearchPosts(
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Post>> {
  const response = await get<PaginatedResponse<Post>>(
    `/social/posts/search?q=${encodeURIComponent(
      query,
    )}&_author=true&page=${page}&limit=${limit}`,
  );
  if (!response)
    throw new Error("No response received from getPaginatedSearchPosts.");
  return response;
}

export async function getPaginatedSearchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Profile>> {
  const response = await get<PaginatedResponse<Profile>>(
    `/social/profiles/search?q=${encodeURIComponent(
      query,
    )}&page=${page}&limit=${limit}`,
  );
  if (!response)
    throw new Error("No response received from getPaginatedSearchProfiles.");
  return response;
}
