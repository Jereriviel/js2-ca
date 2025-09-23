import { createLoadMoreButton } from "../components/loadMoreButton";
import { initFollowButtons } from "../components/followButton";
import { initPostLinks } from "./initPostLinks";
import { initProfileLinks } from "./initProfileLinks";
import { initEditPostButtons } from "../components/postCard";

export async function initPaginatedList<T>(options: {
  container: HTMLElement;
  fetchItems: (page: number) => Promise<{ data: T[]; meta: any }>;
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
      items.map((item) => Promise.resolve(renderItem(item)))
    );
    container.innerHTML = htmlArr.join("");

    if (isPostList) {
      initPostLinks(container);
      initEditPostButtons(items as any);
    }
    initProfileLinks(container);
    initFollowButtons();
    if (onAfterRender) onAfterRender(items);

    const btnContainer =
      loadMoreContainer ?? container.parentElement ?? container;
    const loadMoreBtn = createLoadMoreButton({
      container,
      fetchItems,
      renderItem,
      onAfterRender: () => {
        if (isPostList) initEditPostButtons(items as any);
        initPostLinks(container);
        initProfileLinks(container);
        initFollowButtons();
        if (onAfterRender) onAfterRender(items);
      },
    });

    btnContainer.appendChild(loadMoreBtn);
  } catch (err) {
    container.innerHTML = `<p>Error loading items.</p>`;
    console.error(err);
  }
}
