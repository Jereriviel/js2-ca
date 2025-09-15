export interface Profile {
  name: string;
  email: string;
  bio?: string;
  banner?: {
    url: string;
    alt?: string;
  };
  avatar?: {
    url: string;
    alt?: string;
  };
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface ProfileResponse {
  data: Profile;
  meta: Record<string, any>;
}
