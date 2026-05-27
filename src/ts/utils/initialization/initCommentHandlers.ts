import { showErrorModal } from "../../components/modals/errorModal";
import { handleError } from "../../errors/handleError";
import { showConfirmModal } from "../../components/modals/confirmModal";
import { deleteComment } from "../../services/postsService";

let commentHandlersInitialized = false;

export function initCommentHandlers(
  onSubmit: (postId: number, body: string) => Promise<void>,
) {
  if (commentHandlersInitialized) return;
  commentHandlersInitialized = true;

  document.addEventListener("submit", async (e: SubmitEvent) => {
    const target = e.target;

    if (!(target instanceof HTMLFormElement)) return;
    if (!target.classList.contains("comment-form")) return;

    e.preventDefault();

    const postId = Number(target.dataset.postId);
    const textarea = target.querySelector("textarea");

    if (!(textarea instanceof HTMLTextAreaElement)) return;

    const body = textarea.value.trim();
    if (!body) return;

    try {
      await onSubmit(postId, body);
      textarea.value = "";
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });

  document.addEventListener("click", async (e: MouseEvent) => {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest(".delete-comment-btn");

    if (!(btn instanceof HTMLButtonElement)) return;

    const commentId = Number(btn.dataset.commentId);
    const postId = Number(btn.dataset.postId);

    if (!commentId || !postId) return;

    const confirmed = await showConfirmModal(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      await deleteComment(postId, commentId);

      const commentDiv = btn.closest(".comment");
      commentDiv?.remove();
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });
}
