import { feedView } from "../views/feed";
import { loginView } from "../views/login";
import { postView } from "../views/post";
import { profileView } from "../views/profile";
import { registerView } from "../views/register";
import { searchView } from "../views/search";
import { startView } from "../views/start";
import { notFoundView } from "../views/notFound";

export const routes = {
  "/feed": feedView,
  "/login": loginView,
  "/post": postView,
  "/profile": (username?: string) => profileView(username),
  "/register": registerView,
  "/search": searchView,
  "/": startView,
  "*": notFoundView,
};
