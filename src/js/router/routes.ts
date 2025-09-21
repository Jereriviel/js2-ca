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

export const routes = {
  "/feed": feedView,
  "/feed/following": followingView,
  "/login": loginView,
  "/post": postView,
  "/profile": (username?: string) => profileView(username),
  "/profile/:username/followers": (username: string) =>
    profileFollowersView(username),
  "/profile/:username/following": (username: string) =>
    profileFollowingView(username),
  "/register": registerView,
  "/search": searchView,
  "/": startView,
  "*": notFoundView,
};
