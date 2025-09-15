import { get } from "./apiService";
import type { PostsResponse, SinglePostResponse } from "../types/post";

export async function getAllPosts(): Promise<PostsResponse> {
  return get(`/social/posts?_author=true`);
}

export async function getPost(id: number): Promise<SinglePostResponse> {
  return get(`/social/posts/${id}?_author=true&_comments=true&_reactions=true`);
}
