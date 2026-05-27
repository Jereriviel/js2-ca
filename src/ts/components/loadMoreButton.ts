import type { PaginatedResponse } from "../types/post";
import { toggleButtonLoading } from "../utils/toggleButtonLoading";
import { showErrorModal } from "./modals/errorModal";
import { handleError } from "../errors/handleError";

export function createLoadMoreButton<T>(options: {
  container: HTMLElement;
  fetchItems: (page: number) => Promise<PaginatedResponse<T>>;
  renderItem: (item: T) => HTMLElement | Promise<HTMLElement>;
  onAfterRender?: (newItems: T[]) => void;
}): HTMLButtonElement {
  const { container, fetchItems, renderItem, onAfterRender } = options;

  const button = document.createElement("button");

  button.id = "load-more-btn";
  button.textContent = "Load More";

  button.classList.add(
    "font-medium",
    "hover:bg-gray-medium",
    "w-[8rem]",
    "py-2",
    "px-5",
    "rounded-full",
    "flex",
    "justify-center",
  );

  let currentPage = 1;
  let isFetching = false;

  async function fetchAndRender(page: number) {
    isFetching = true;

    toggleButtonLoading(button, true, "Loading more posts...");

    try {
      const response = await fetchItems(page);

      const items = response.data;
      const meta = response.meta;

      const renderedItems = await Promise.all(
        items.map((item) => renderItem(item)),
      );

      renderedItems.forEach((el) => {
        container.appendChild(el);
      });

      onAfterRender?.(items);

      if (meta?.isLastPage) {
        button.style.display = "none";
      }
    } catch (error) {
      await showErrorModal(handleError(error));

      button.textContent = "Failed to load. Try again?";
      button.disabled = false;
    } finally {
      isFetching = false;

      toggleButtonLoading(button, false);
    }
  }

  button.addEventListener("click", () => {
    if (isFetching) return;

    currentPage++;

    void fetchAndRender(currentPage);
  });

  return button;
}
