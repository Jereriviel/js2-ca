type ViewResult = {
  html: string;
  init?: () => void;
};

type View = () => ViewResult | Promise<ViewResult>;

interface Routes {
  [path: string]: View;
}

export class Router {
  private routes: Routes;
  private outlet: HTMLElement;

  constructor(routes: Routes, outlet: HTMLElement) {
    this.routes = routes;
    this.outlet = outlet;

    window.addEventListener("popstate", () => {
      this.resolveRoute(location.pathname);
    });

    this.resolveRoute(location.pathname);
  }

  navigate(path: string): void {
    if (location.pathname !== path) {
      history.pushState({}, "", path);
      this.resolveRoute(path);
    }
  }

  async resolveRoute(path: string): Promise<void> {
    const view = this.routes[path] || this.routes["*"];
    if (view) {
      const { html, init } = await view();
      this.outlet.innerHTML = html;

      if (init) {
        init();
      }
    }
  }
}
