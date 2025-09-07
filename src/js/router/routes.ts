import { feedView } from "../views/feed";
import { loginView } from "../views/login";
import { postView } from "../views/post";
import { profileView } from "../views/profile";
import { registerView } from "../views/register";
import { startView } from "../views/start";
import { notFoundView } from "../views/notfound";

export const routes = {
  "/feed": feedView,
  "/login": loginView,
  "/post": postView,
  "/profile": profileView,
  "/register": registerView,
  "/": startView,
  "*": notFoundView,
};
