export interface Media {
  url: string;
  alt?: string;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  banner?: Media;
  avatar?: Media;

  _count?: {
    followers: number;
    following: number;
    posts: number;
  };

  followers?: Profile[];

  following?: Profile[];
}

export interface ProfileResponse {
  data: Profile;
  meta: Record<string, any>;
}
