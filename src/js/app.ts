import { get } from "./services/apiService";
import { loginUser, registerUser } from "./services/authService";
import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { isLoggedIn, getUser, clearUser } from "./store/userStore";

const outlet = document.getElementById("app") as HTMLElement;
export const router = new Router(routes, outlet);
