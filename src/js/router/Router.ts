import { setNavigate } from "../utils/navigate";

type ViewResult = {
  html: string;
  init?: () => void | Promise<void>;
};

type View = (data?: any) => ViewResult | Promise<ViewResult>;

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

  navigate(path: string, data?: any): void {
    if (location.pathname !== path) {
      history.pushState(data || {}, "", path);
      this.resolveRoute(path);
    }
  }

  public async refresh(): Promise<void> {
    await this.resolveRoute(location.pathname);
  }

  private async resolveRoute(path: string): Promise<void> {
    let view;

    if (path.startsWith("/profile")) {
      const parts = path.split("/");
      const username = parts[2];
      view = this.routes["/profile"];
      if (view) {
        const { html, init } = await view(username);
        this.outlet.innerHTML = html;
        if (init) await init();
        return;
      }
    }

    if (path.startsWith("/post")) {
      const parts = path.split("/");
      const id = Number(parts[2]);
      view = this.routes["/post"];
      if (view) {
        const { html, init } = await view(id);
        this.outlet.innerHTML = html;
        if (init) await init();
        return;
      }
    }

    view = this.routes[path] || this.routes["*"];
    if (!view) {
      this.outlet.innerHTML = `<p>Route not found</p>`;
      return;
    }

    const { html, init } = await view();
    this.outlet.innerHTML = html;
    if (init) await init();
  }
}
