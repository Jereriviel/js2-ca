import { get } from "./apiService";
import type {
  PostsResponse,
  SinglePostResponse,
  Post,
  PaginatedResponse,
} from "../types/post";

export async function getAllPosts(): Promise<PostsResponse> {
  return get(`/social/posts?_author=true`);
}

export async function getPost(id: number): Promise<SinglePostResponse> {
  return get(`/social/posts/${id}?_author=true&_comments=true&_reactions=true`);
}

export async function getPaginatedPosts(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Post>> {
  return get(`/social/posts?_author=true&page=${page}&limit=${limit}`);
}

export async function getPaginatedProfilePosts(
  username: string,
  page: number = 1,
  limit: number = 5
): Promise<PaginatedResponse<Post>> {
  return get(
    `/social/profiles/${username}/posts?_author=true&page=${page}&limit=${limit}`
  );
}
