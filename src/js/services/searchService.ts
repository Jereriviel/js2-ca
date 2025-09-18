import { get } from "./apiService";
import type { Post } from "../types/post";
import type { Profile } from "../types/profile";
import type { PaginatedResponse } from "../types/post";

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
  return get<SearchPostsResponse>(
    `/social/posts/search?q=${encodeURIComponent(query)}&_author=true`
  );
}

export async function searchProfiles(
  query: string
): Promise<SearchProfilesResponse> {
  return get<SearchProfilesResponse>(
    `/social/profiles/search?q=${encodeURIComponent(query)}`
  );
}

export async function getPaginatedSearchPosts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<any>> {
  return get(
    `/social/posts/search?q=${encodeURIComponent(
      query
    )}&_author=true&page=${page}&limit=${limit}`
  );
}

export async function getPaginatedSearchProfiles(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Profile>> {
  return get(
    `/social/profiles/search?q=${encodeURIComponent(
      query
    )}&page=${page}&limit=${limit}`
  );
}
