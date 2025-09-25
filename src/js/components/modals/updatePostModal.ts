import { updatePost, deletePost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "../modals/errorModal";
import { showConfirmModal } from "../modals/confirmModal";
import { goTo } from "../../utils/navigate";

export function openUpdatePostModal(post: Post) {
  const modal = document.createElement("dialog");
  modal.classList.add("update-post-modal");

  modal.innerHTML = `
    <form method="dialog" class="update-post-form">
      <h2>Edit Post</h2>

      <label>
        Title (required):
        <input type="text" name="title" required value="${post.title}" />
      </label>

      <label>
        Body:
        <textarea name="body" placeholder="Write your post...">${
          post.body || ""
        }</textarea>
      </label>

      <label>
        Media URL:
        <input type="url" name="mediaUrl" placeholder="https://..." value="${
          post.media?.url || ""
        }" />
      </label>

      <label>
        Media alt text:
        <input type="text" name="mediaAlt" placeholder="Image description" value="${
          post.media?.alt || ""
        }" />
      </label>

      <div class="modal-actions">
        <button type="submit">Save Changes</button>
        <button type="button" id="deleteBtn" class="danger">Delete</button>
        <button type="button" id="cancelBtn">Cancel</button>
      </div>
      <p class="error-message"></p>
    </form>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  const form = modal.querySelector<HTMLFormElement>("form.update-post-form")!;
  const cancelBtn = form.querySelector<HTMLButtonElement>("#cancelBtn")!;
  const deleteBtn = form.querySelector<HTMLButtonElement>("#deleteBtn")!;
  const errorEl = form.querySelector<HTMLParagraphElement>(".error-message")!;

  cancelBtn.addEventListener("click", () => modal.close());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const mediaUrl = formData.get("mediaUrl") as string;
    const mediaAlt = formData.get("mediaAlt") as string;

    if (!title) {
      errorEl.textContent = "Title is required.";
      return;
    }

    const postData: Partial<Post> = { title };
    if (body) postData.body = body;
    if (mediaUrl) {
      postData.media = {
        url: mediaUrl,
        alt: mediaAlt || "Post image",
      };
    }

    try {
      await updatePost(post.id, postData);
      modal.close();
      modal.remove();
      await router.refresh();
    } catch (err: any) {
      console.error("Failed to update post:", err);
      errorEl.textContent =
        err?.message || "Failed to update post. Please try again.";
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await deletePost(post.id);
      modal.close();
      modal.remove();
      if (history.length > 1) {
        history.back();
      } else {
        goTo("/feed");
      }
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      await showErrorModal(
        err?.message || "Failed to delete post. Please try again."
      );
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
