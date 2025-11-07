import { setNavigate } from "../utils/navigate";
import { updateMetadata } from "../utils/metadata";

type ViewResult = {
  html: string;
  init?: () => void | Promise<void>;
};

type ViewData = string | number;

export interface Route {
  view: (param?: string | number) => ViewResult | Promise<ViewResult>;
  metadata: {
    title: string;
    description: string;
  };
}

export interface DynamicRoute {
  view: (param?: string) => ViewResult | Promise<ViewResult>;
  getMetadata: (param: string) => {
    title: string;
    description: string;
  };
}

export class Router {
  private routes: Record<string, Route | DynamicRoute>;

  private outlet: HTMLElement;

  constructor(
    routes: Record<string, Route | DynamicRoute>,
    outlet: HTMLElement,
  ) {
    this.routes = routes;
    this.outlet = outlet;

    setNavigate((path: string) => this.navigate(path));

    window.addEventListener("popstate", () => {
      this.resolveRoute(location.pathname);
    });

    this.resolveRoute(location.pathname);
  }

  navigate(path: string, data?: ViewData): void {
    if (location.pathname !== path) {
      history.pushState(data || {}, "", path);
      this.resolveRoute(path);
    }
  }

  public async refresh(): Promise<void> {
    await this.resolveRoute(location.pathname);
  }

  private async resolveRoute(path: string): Promise<void> {
    let routeKey = path;
    let param: string | number | undefined;

    if (path === "/profile") {
      routeKey = "/profile";
    } else if (path.startsWith("/profile/")) {
      const parts = path.split("/").filter(Boolean);
      const username = parts[1];
      const subpage = parts[2];

      if (subpage === "followers") {
        routeKey = "/profile/:username/followers";
      } else if (subpage === "following") {
        routeKey = "/profile/:username/following";
      } else {
        routeKey = "/profile/:username";
      }
      param = username;
    } else if (path.startsWith("/post/")) {
      const parts = path.split("/");
      routeKey = "/post";
      param = Number(parts[2]);
    }

    const route = this.routes[routeKey] || this.routes["*"];
    if (!route) {
      this.outlet.innerHTML = `<p>Route not found</p>`;
      return;
    }

    if ("metadata" in route) {
      updateMetadata(route.metadata.title, route.metadata.description);
    } else if ("getMetadata" in route && param) {
      const { title, description } = route.getMetadata(String(param));
      updateMetadata(title, description);
    } else {
      updateMetadata("Hearth", "A social platform for sharing stories.");
    }

    let result: ViewResult;

    if ("getMetadata" in route) {
      result = await route.view(param ? String(param) : undefined);
    } else {
      result = await route.view(param);
    }

    const { html, init } = result;
    this.outlet.innerHTML = html;
    if (init) await init();
  }
}
