import { createLoadMoreButton } from "../../components/loadMoreButton";
import { initFollowButtons } from "../../components/followButton";
import { initPostLinks } from "./initPostLinks";
import { initProfileLinks } from "./initProfileLinks";
import { initEditPostButtons } from "../../components/postCard";
import type { PaginatedResponse, Post } from "../../types/post";
import { initLazyLoadImages } from "../lazyLoadImages";
import { showErrorModal } from "../../components/modals/errorModal";
import { handleError } from "../../errors/handleError";

export async function initPaginatedList<T>(options: {
  container: HTMLElement;
  fetchItems: (page: number) => Promise<PaginatedResponse<T>>;
  renderItem: (item: T) => Promise<HTMLElement> | HTMLElement;
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
    const meta = response.meta;

    container.innerHTML = "";

    const elements = await Promise.all(items.map((item) => renderItem(item)));

    elements.forEach((el) => container.appendChild(el));

    if (isPostList) {
      initPostLinks(container);
      initEditPostButtons(items as Post[]);
    }

    initProfileLinks(container);
    initFollowButtons();
    initLazyLoadImages();

    if (onAfterRender) onAfterRender(items);

    if (!meta?.isLastPage) {
      const btnContainer =
        loadMoreContainer ?? container.parentElement ?? container;

      const existingButton = btnContainer.querySelector("#load-more-btn");
      if (existingButton) existingButton.remove();

      const loadMoreBtn = createLoadMoreButton({
        container,
        fetchItems,
        renderItem,
        onAfterRender: async (newItems) => {
          const newElements = await Promise.all(
            newItems.map((item) => renderItem(item)),
          );

          newElements.forEach((el) => container.appendChild(el));

          if (isPostList) initEditPostButtons(newItems as Post[]);

          initPostLinks(container);
          initProfileLinks(container);
          initFollowButtons();
          initLazyLoadImages();

          if (onAfterRender) onAfterRender(newItems);
        },
      });

      btnContainer.appendChild(loadMoreBtn);
    }
  } catch (error) {
    await showErrorModal(handleError(error));
  }
}
