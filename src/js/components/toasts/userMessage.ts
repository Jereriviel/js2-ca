export function showUserMessage(message: string): void {
  const existing = document.querySelector(".user-message");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.className =
    "user-message animate-fade-in fixed top-4 right-4 z-[1000] w-fit max-w-sm rounded-2xl border border-red-200 bg-red-100 px-4 py-2 shadow-lg";

  const msgEl = document.createElement("p");
  msgEl.textContent = message;
  container.append(msgEl);

  document.body.appendChild(container);

  setTimeout(() => {
    container.classList.add("animate-fade-out");
    setTimeout(() => container.remove(), 500);
  }, 4000);
}
