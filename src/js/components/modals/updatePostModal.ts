import { updatePost, deletePost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "../modals/errorModal";
import { showConfirmModal } from "../modals/confirmModal";
import { goTo } from "../../utils/navigate";
import { inputModal, textArea } from "../inputs";
import { createModal } from "../../utils/createModal";

export function openUpdatePostModal(post: Post) {
  const modal = createModal(`

<form
      method="dialog"
      class="update-post-form flex flex-col gap-4 min-w-[375px]">
      <div class="flex justify-between items-center">
      <h2 class="font-semibold text-xl">Edit Post</h2>
      <button type="button" id="cancelBtn" class="font-medium hover:bg-gray-medium w-fit py-4 px-5 rounded-full">Cancel</button>
      </div>
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
        <button type="button" id="deleteBtn" class="bg-red-500 hover:bg-red-700 text-white text- w-fit py-4 px-5 rounded-full mt-4">Delete</button>
        <button type="submit" class="bg-primary hover:bg-primary-hover text-white text- w-fit py-4 px-5 rounded-full mt-4">Save Changes</button>
        </div>
      <p class="error-message"></p>
    </form>
  `);

  document.body.appendChild(modal);
  modal.showModal();

  const form = modal.querySelector<HTMLFormElement>("form.update-post-form")!;
  const cancelBtn = form.querySelector<HTMLButtonElement>("#cancelBtn")!;
  const deleteBtn = form.querySelector<HTMLButtonElement>("#deleteBtn")!;
  const errorEl = form.querySelector<HTMLParagraphElement>(".error-message")!;

  form.querySelector<HTMLInputElement>("#title")!.value = post.title || "";
  form.querySelector<HTMLTextAreaElement>("#body")!.value = post.body || "";
  form.querySelector<HTMLInputElement>("#imageUrl")!.value =
    post.media?.url || "";
  form.querySelector<HTMLInputElement>("#imageAlt")!.value =
    post.media?.alt || "";

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
