import { feedView } from "../views/feed";
import { followingView } from "../views/following";
import { loginView } from "../views/login";
import { postView } from "../views/post";
import { profileView } from "../views/profile";
import { registerView } from "../views/register";
import { searchView } from "../views/search";
import { startView } from "../views/start";
import { notFoundView } from "../views/notFound";
import { profileFollowersView } from "../views/profileFollowers";
import { profileFollowingView } from "../views/profileFollowing";
import type { Route, DynamicRoute } from "./Router";

export const routes: Record<string, Route | DynamicRoute> = {
  "/feed": {
    view: feedView,
    metadata: {
      title: "Hearth | Feed",
      description: "See the latest posts from everyone on the platform.",
    },
  },

  "/feed/following": {
    view: followingView,
    metadata: {
      title: "Hearth | Following",
      description:
        "See the latest posts from people you follow on the platform.",
    },
  },

  "/login": {
    view: loginView,
    metadata: {
      title: "Hearth | Sign In",
      description: "Sign in to your account to get started.",
    },
  },

  "/post": {
    view: postView,
    metadata: {
      title: "Hearth | Post",
      description: "View this authors post.",
    },
  },

  "/profile": {
    view: profileView,
    getMetadata: (username?: string) => ({
      title: username ? `Hearth | @${username}'s Profile` : "Your Profile",
      description: username
        ? `View the profile and activity of @${username}.`
        : "Manage your profile and settings.",
    }),
  },

  "/profile/:username/followers": {
    view: profileFollowersView,
    getMetadata: (username: string) => ({
      title: `Hearth | Followers of @${username}`,
      description: `See everyone who follows @${username}.`,
    }),
  },

  "/profile/:username/following": {
    view: profileFollowingView,
    getMetadata: (username: string) => ({
      title: `Hearth | Followers of @${username}`,
      description: `See everyone @${username} is following.`,
    }),
  },

  "/register": {
    view: registerView,
    metadata: {
      title: "Hearth | Register",
      description: "Register for your account to get started.",
    },
  },

  "/search": {
    view: searchView,
    metadata: {
      title: "Hearth | Search",
      description: "Search for posts or profiles.",
    },
  },

  "/": {
    view: startView,
    metadata: {
      title: "Hearth | Welcome",
      description:
        "Welcome to the Hearth Social Media app, where you can be part of our community and share your stories!",
    },
  },

  "*": {
    view: notFoundView,
    metadata: {
      title: "Hearth | Page Not Found",
      description: "The page you are looking for does not exist.",
    },
  },
};
