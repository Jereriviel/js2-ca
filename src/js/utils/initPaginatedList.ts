import { createLoadMoreButton } from "../components/loadMoreButton";
import { initFollowButtons } from "../components/followButton";
import { initPostLinks } from "./initPostLinks";
import { initProfileLinks } from "./initProfileLinks";
import { initEditPostButtons } from "../components/postCard";
import type { PaginatedResponse, Post } from "../types/post";
import { initLazyLoadImages } from "./lazyLoadImages";

export async function initPaginatedList<T>(options: {
  container: HTMLElement;
  fetchItems: (page: number) => Promise<PaginatedResponse<T>>;
  renderItem: (item: T) => string | Promise<string>;
  onAfterRender?: (items: T[]) => void;
  isPostList?: boolean;
  loadMoreContainer?: HTMLElement;
}) {
  const {
    container,
    fetchItems,
    renderItem,
    onAfterRender,
    isPostList,
    loadMoreContainer,
  } = options;

  try {
    const response = await fetchItems(1);
    const items = response.data;

    const htmlArr = await Promise.all(
      items.map((item) => Promise.resolve(renderItem(item))),
    );
    container.innerHTML = htmlArr.join("");

    if (isPostList) {
      initPostLinks(container);
      initEditPostButtons(items as Post[]);
    }
    initProfileLinks(container);
    initFollowButtons();
    if (onAfterRender) onAfterRender(items);
    initLazyLoadImages();

    const btnContainer =
      loadMoreContainer ?? container.parentElement ?? container;
    const loadMoreBtn = createLoadMoreButton({
      container,
      fetchItems,
      renderItem,
      onAfterRender: async (newItems) => {
        if (isPostList) initEditPostButtons(newItems as Post[]);
        initPostLinks(container);
        initProfileLinks(container);
        initFollowButtons();
        initLazyLoadImages();
        if (onAfterRender) onAfterRender(newItems);
      },
    });

    btnContainer.appendChild(loadMoreBtn);
  } catch (error) {
    let message = "Error loading items.";
    if (error instanceof Error) {
      message = error.message;
    }
    container.innerHTML = `<p>${message}</p>`;
    console.error("initPaginatedList error:", error);
  }
}
