import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { setNavigate } from "./utils/navigate";
import { navigation, initNavigation } from "./components/navigation";
import { getUser } from "./store/userStore";

const outlet = document.getElementById("app") as HTMLElement;
export const router = new Router(routes, outlet);

setNavigate(router.navigate.bind(router));

export async function renderLayout() {
  const navbarContainer = document.getElementById("navbar")!;
  const user = getUser();

  if (user) {
    navbarContainer.classList.remove("hidden");
    navbarContainer.innerHTML = await navigation();

    initNavigation();
  } else {
    navbarContainer.classList.add("hidden");
  }
}

renderLayout();
