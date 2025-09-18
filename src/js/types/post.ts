import type { Profile } from "./profile";

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: {
    url: string;
    alt?: string;
  } | null;
  created: string;
  updated: string;
  _count: {
    comments: number;
    reactions: number;
  };

  author?: Profile;
  comments?: Comment[];
  reactions?: Reaction[];
}

export interface Comment {
  id: number;
  body: string;
  replyToId: number | null;
  postId: number;
  owner: string;
  created: string;
  author: Profile;
}

export interface Reaction {
  symbol: string;
  count: number;
  reactors: string[];
}

export interface PostsResponse {
  data: Post[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

export interface SinglePostResponse {
  data: Post;
  meta: Record<string, never>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}
