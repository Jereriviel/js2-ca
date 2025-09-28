export function createLoadMoreButton<T>(options: {
  container: HTMLElement;
  fetchItems: (page: number) => Promise<{ data: T[]; meta: any }>;
  renderItem: (item: T) => string | Promise<string>;
  onAfterRender?: (newItems: T[]) => void;
}): HTMLButtonElement {
  const { container, fetchItems, renderItem, onAfterRender } = options;

  const button = document.createElement("button");
  button.id = "load-more-btn";
  button.textContent = "Load More";
  button.classList.add(
    "font-medium",
    "hover:bg-gray-medium",
    "w-fit",
    "py-4",
    "px-5",
    "rounded-full"
  );

  let currentPage = 1;
  let isFetching = false;

  async function fetchAndRender(page: number) {
    isFetching = true;
    button.textContent = "Loading...";
    button.disabled = true;

    try {
      const response = await fetchItems(page);
      const items = response.data;
      const meta = response.meta;

      const htmlPromises = items.map((item) =>
        Promise.resolve(renderItem(item))
      );
      const htmlArr = await Promise.all(htmlPromises);

      container.insertAdjacentHTML("beforeend", htmlArr.join(""));

      if (onAfterRender) onAfterRender(items);

      if (meta?.isLastPage) {
        button.style.display = "none";
      } else {
        button.textContent = "Load More";
        button.disabled = false;
      }
    } catch (err) {
      console.error("Failed to load items:", err);
      button.textContent = "Failed to load. Try again?";
      button.disabled = false;
    } finally {
      isFetching = false;
    }
  }

  button.addEventListener("click", () => {
    if (isFetching) return;
    currentPage++;
    void fetchAndRender(currentPage);
  });

  return button;
}
