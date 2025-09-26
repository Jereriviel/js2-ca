import { createPost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "../modals/errorModal";
import { inputModal, textArea } from "../inputs";
import { createModal } from "../../utils/createModal";

export function openCreatePostModal() {
  const modal = createModal(`
    <form
      method="dialog"
      class="create-post-form flex flex-col gap-4 min-w-[600px]"
    >
      <h2 class="font-semibold text-xl">Create New Post</h2>
      <div class="flex flex-col gap-4">
      ${inputModal({
        type: "text",
        name: "title",
        placeholder: "Write a title for your post...",
        required: true,
        label: "Title",
        id: "title",
      })}

      ${textArea({
        type: "text",
        name: "body",
        placeholder: "Write your post...",
        required: true,
        label: "Post",
        id: "body",
      })}

      ${inputModal({
        type: "url",
        name: "imageUrl",
        placeholder: "https://...",
        required: false,
        label: "Image URL",
        id: "imageUrl",
      })}

      ${inputModal({
        type: "text",
        name: "imageAlt",
        placeholder: "Image description...",
        required: false,
        label: "Image alt text",
        id: "imageAlt",
      })}
      </div>
      <div class="modal-actions flex justify-between">
        <button type="button" id="cancelBtn" class="font-medium hover:bg-gray-medium w-fit py-4 px-5 rounded-full mt-4">Cancel</button>
        <button type="submit" class=" bg-primary hover:bg-primary-hover text-white text- w-fit py-4 px-5 rounded-full mt-4">Publish</button>
      </div>
      <p class="error-message"></p>
    </form>
  `);

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
    const mediaUrl = formData.get("imageUrl") as string;
    const mediaAlt = formData.get("imageAlt") as string;

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
