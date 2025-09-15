import { Router } from "./router/Router";
import { routes } from "./router/routes";
import { setNavigate } from "./utils/navigate";

const outlet = document.getElementById("app") as HTMLElement;
export const router = new Router(routes, outlet);

setNavigate(router.navigate.bind(router));
