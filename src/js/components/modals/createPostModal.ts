import { createPost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "../modals/errorModal";

export function openCreatePostModal() {
  const modal = document.createElement("dialog");
  modal.classList.add("create-post-modal");

  modal.innerHTML = `
    <form method="dialog" class="create-post-form">
      <h2>Create New Post</h2>

      <label>
        Title (required):
        <input type="text" name="title" required />
      </label>

      <label>
        Body:
        <textarea name="body" placeholder="Write your post..."></textarea>
      </label>

      <label>
        Media URL:
        <input type="url" name="mediaUrl" placeholder="https://..." />
      </label>

      <label>
        Media alt text:
        <input type="text" name="mediaAlt" placeholder="Image description" />
      </label>

      <div class="modal-actions">
        <button type="submit">Publish</button>
        <button type="button" id="cancelBtn">Cancel</button>
      </div>
      <p class="error-message"></p>
    </form>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  const form = modal.querySelector<HTMLFormElement>("form.create-post-form")!;
  const cancelBtn = form.querySelector<HTMLButtonElement>("#cancelBtn")!;
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
      await createPost(postData);
      modal.close();
      modal.remove();
      await router.refresh();
    } catch (err: any) {
      console.error("Failed to create post:", err);
      await showErrorModal(
        err?.message || "Failed to create post. Please try again."
      );
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
