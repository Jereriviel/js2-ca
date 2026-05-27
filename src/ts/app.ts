import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { setNavigate } from "./utils/navigate";
import {
  navigation,
  initNavigation,
  loadNavMiniProfile,
} from "./components/navigation";
import { getUser } from "./store/userStore";

const outlet = document.getElementById("app") as HTMLElement;
export const router = new Router(routes, outlet);

setNavigate(router.navigate.bind(router));

export function renderLayout() {
  const navbarContainer = document.getElementById("navbar-container");
  const user = getUser();

  if (!navbarContainer) {
    console.error("Navbar container missing from DOM");
    return;
  }

  if (user) {
    navbarContainer.classList.remove("hidden");
    navbarContainer.innerHTML = "";

    const nav = navigation();
    if (nav) navbarContainer.appendChild(nav);

    initNavigation();
    loadNavMiniProfile();
  } else {
    navbarContainer.classList.add("hidden");
    navbarContainer.innerHTML = "";
  }
}

renderLayout();
