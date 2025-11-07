let navigateFn: ((path: string) => void) | null = null;

export function setNavigate(fn: (path: string) => void) {
  navigateFn = fn;
}

export function goTo(path: string) {
  if (!navigateFn) {
    throw new Error("navigate not initialized yet");
  }
  navigateFn(path);
}
