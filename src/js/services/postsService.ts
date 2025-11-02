import { get, post, put, del } from "./apiService";
import { handleError } from "../errors/handleError";
import type {
  PostsResponse,
  SinglePostResponse,
  Post,
  PaginatedResponse,
  Comment,
} from "../types/post";

export async function getAllPosts(): Promise<PostsResponse | null> {
  try {
    return await get<PostsResponse>(`/social/posts?_author=true`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPost(id: number): Promise<SinglePostResponse | null> {
  try {
    return await get<SinglePostResponse>(
      `/social/posts/${id}?_author=true&_comments=true&_reactions=true`,
    );
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getFollowingPosts(): Promise<PaginatedResponse<Post> | null> {
  try {
    return await get<PaginatedResponse<Post>>(
      `/social/posts/following?_author=true`,
    );
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPaginatedPosts(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Post>> {
  try {
    const response = await get<PaginatedResponse<Post>>(
      `/social/posts?_author=true&page=${page}&limit=${limit}`,
    );
    if (!response) throw new Error("Failed to fetch posts");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPaginatedProfilePosts(
  username: string | number,
  page: number = 1,
  limit: number = 5,
): Promise<PaginatedResponse<Post>> {
  try {
    const response = await get<PaginatedResponse<Post>>(
      `/social/profiles/${username}/posts?_author=true&page=${page}&limit=${limit}`,
    );
    if (!response) throw new Error("Failed to fetch profile posts");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getPaginatedFollowingPosts(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Post>> {
  try {
    const response = await get<PaginatedResponse<Post>>(
      `/social/posts/following?_author=true&page=${page}&limit=${limit}`,
    );
    if (!response) throw new Error("Failed to fetch following posts");
    return response;
  } catch (error) {
    throw new Error(handleError(error));
  }
}
export async function addComment(
  postId: number,
  body: string,
): Promise<Comment | null> {
  try {
    const response = await post<{ data: Comment }>(
      `/social/posts/${postId}/comment`,
      { body },
    );
    return response?.data ?? null;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  try {
    await del<void>(`/social/posts/${postId}/comment/${commentId}`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function createPost(
  postData: Partial<Post>,
): Promise<Post | null> {
  try {
    const response = await post<{ data: Post }>(`/social/posts`, postData);
    return response?.data ?? null;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function updatePost(
  postId: number,
  postData: Partial<Post>,
): Promise<Post | null> {
  try {
    const response = await put<{ data: Post }>(
      `/social/posts/${postId}`,
      postData,
    );
    return response?.data ?? null;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function deletePost(postId: number): Promise<void> {
  try {
    await del<void>(`/social/posts/${postId}`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}
