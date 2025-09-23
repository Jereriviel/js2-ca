import { deleteComment } from "../services/postsService";
import { showErrorModal } from "./modals/errorModal";
import { showConfirmModal } from "./modals/confirmModal";

export function commentForm(postId: number): string {
  return `
    <form class="comment-form" data-post-id="${postId}">
      <textarea
        name="comment"
        placeholder="Write a comment..."
        required
      ></textarea>
      <button type="submit">Post Comment</button>
    </form>
  `;
}

export function initCommentForms(
  onSubmit: (postId: number, body: string) => Promise<void>
) {
  document
    .querySelectorAll<HTMLFormElement>(".comment-form")
    .forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postId = Number(form.dataset.postId);
        const textarea = form.querySelector<HTMLTextAreaElement>("textarea")!;
        const body = textarea.value.trim();
        if (!body) return;

        try {
          await onSubmit(postId, body);
          textarea.value = "";

          const commentsContainer = form
            .closest("article")
            ?.querySelector(".comments-container") as HTMLElement | null;
          if (commentsContainer) {
            initDeleteCommentButtons(commentsContainer);
          }
        } catch (err) {
          console.error("Failed to post comment:", err);
          await showErrorModal("Failed to post comment. Please try again.");
        }
      });
    });
}

export function initDeleteCommentButtons(container: HTMLElement) {
  container
    .querySelectorAll<HTMLButtonElement>(".delete-comment-btn")
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const commentId = Number(btn.dataset.commentId);
        const postId = Number(btn.dataset.postId);
        if (!commentId || !postId) return;

        const confirmed = await showConfirmModal(
          "Are you sure you want to delete this comment?"
        );
        if (!confirmed) return;

        try {
          await deleteComment(postId, commentId);
          const commentDiv = btn.closest(".comment");
          if (commentDiv) commentDiv.remove();
        } catch (err) {
          console.error("Failed to delete comment:", err);
          await showErrorModal("Failed to delete comment. Please try again.");
        }
      });
    });
}
