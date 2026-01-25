import { deleteComment } from "../services/postsService";
import { showErrorModal } from "./modals/errorModal";
import { showConfirmModal } from "./modals/confirmModal";
import { textArea } from "./inputs";
import { getCurrentUserProfile } from "../services/profileService";
import type { Profile } from "../types/profile";
import { getUser } from "../store/userStore";

export async function commentForm(postId: number): Promise<string> {
  const loggedInUser = getUser();
  if (!loggedInUser) {
    return `<p class="text-gray-dark text-sm italic">You must be logged in to comment.</p>`;
  }

  let userProfile: Profile | undefined;

  try {
    userProfile = await getCurrentUserProfile(loggedInUser.name);
  } catch (error) {
    console.warn("Failed to fetch logged-in user profile", error);
  }

  return `
    <div class="flex items-start gap-4 py-4" data-post-id="${postId}">
      <div class="profile-link">
        <figure class="w-12 h-12">
          <img
            class="rounded-full w-full h-full object-cover"
            src="${userProfile?.avatar?.url ?? "/default-avatar.png"}"
            alt="${userProfile?.avatar?.alt ?? userProfile?.name ?? "User avatar"}"
          />
        </figure>
      </div>
      <form class="comment-form flex flex-col grow gap-4" data-post-id="${postId}">
        ${textArea({
          type: "text",
          name: "comment",
          placeholder: "Write your comment here...",
          required: true,
          label: "Post a comment",
          id: `comment-${postId}`,
        })}
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="bg-primary hover:bg-primary-hover text-white text-sm w-fit py-2 px-5 rounded-full">
            Post Comment
          </button>
        </div>
      </form>
    </div>
    <hr class="h-[px] bg-gray-medium border-none my-4">
  `;
}

export function initCommentForms(
  onSubmit: (postId: number, body: string) => Promise<void>,
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
        } catch (error) {
          console.error("Failed to post comment:", error);
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
          "Are you sure you want to delete this comment?",
        );
        if (!confirmed) return;

        try {
          await deleteComment(postId, commentId);
          const commentDiv = btn.closest(".comment");
          if (commentDiv) commentDiv.remove();
        } catch (error) {
          console.error("Failed to delete comment:", error);
          await showErrorModal("Failed to delete comment. Please try again.");
        }
      });
    });
}
