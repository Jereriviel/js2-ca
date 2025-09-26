export function createModal(
  content: string,
  className = "app-modal"
): HTMLDialogElement {
  const existing = document.querySelector<HTMLDialogElement>(
    `dialog.${className}`
  );
  if (existing) {
    existing.close();
    existing.remove();
  }

  const modal = document.createElement("dialog");
  modal.classList.add(className);

  modal.classList.add(
    "fixed",
    "top-1/2",
    "left-1/2",
    "-translate-x-1/2",
    "-translate-y-1/2",
    "w-fit",
    "rounded-2xl",
    "shadow-lg",
    "py-8",
    "px-8"
  );

  modal.innerHTML = content;

  modal.addEventListener("close", () => {
    modal.remove();
  });

  return modal;
}
