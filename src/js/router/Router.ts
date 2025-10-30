import { setNavigate } from "../utils/navigate";
import { updateMetadata } from "../utils/metadata";
import { routes as routeConfigs } from "./routes";

type ViewResult = {
  html: string;
  init?: () => void | Promise<void>;
};

type ViewData = string | number;

type View = (data?: ViewData) => ViewResult | Promise<ViewResult>;

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

interface Routes {
  [path: string]: View;
}

export class Router {
  private routes: Routes;
  private outlet: HTMLElement;

  constructor(routes: Routes, outlet: HTMLElement) {
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

    if (path.startsWith("/profile")) {
      const parts = path.split("/");
      const username = parts[2];

      if (parts.length === 4 && parts[3] === "followers") {
        routeKey = "/profile/:username/followers";
        param = username;
      } else if (parts.length === 4 && parts[3] === "following") {
        routeKey = "/profile/:username/following";
        param = username;
      } else {
        routeKey = "/profile";
        param = username;
      }
    } else if (path.startsWith("/post")) {
      const parts = path.split("/");
      routeKey = "/post";
      param = Number(parts[2]);
    }

    const route = routeConfigs[routeKey] || routeConfigs["*"];
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

    const routeConfig = routeConfigs[routeKey] || routeConfigs["*"];
    if (!routeConfig) {
      this.outlet.innerHTML = `<p>Route not found</p>`;
      return;
    }

    const view = routeConfig.view;
    const result = await view();
    const { html, init } = result;
    this.outlet.innerHTML = html;
    if (init) await init();
  }
}
