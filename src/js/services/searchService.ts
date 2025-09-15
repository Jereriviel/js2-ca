import { get } from "./apiService";
import type { Post } from "../types/post";
import type { Profile } from "../types/profile";

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
