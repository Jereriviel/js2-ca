import { updatePost, deletePost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "./errorModal";
import { showConfirmModal } from "./confirmModal";
import { goTo } from "../../utils/navigate";
import { inputModal, textArea } from "../inputs";
import { createModal } from "../../utils/createModal";
import { handleError } from "../../errors/handleError";

export function openUpdatePostModal(post: Post) {
  const modal = createModal("");

  const form = document.createElement("form");
  form.method = "dialog";
  form.className = "update-post-form flex flex-col gap-4 min-w-[375px]";

  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const title = document.createElement("h2");
  title.className = "font-semibold text-xl";
  title.textContent = "Edit Post";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.id = "cancelBtn";
  cancelBtn.className =
    "font-medium hover:bg-gray-medium w-fit py-2 px-5 rounded-full";
  cancelBtn.textContent = "Cancel";

  header.append(title, cancelBtn);

  const fields = document.createElement("div");
  fields.className = "flex flex-col gap-4";

  fields.innerHTML = `
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
  `;

  const actions = document.createElement("div");
  actions.className = "modal-actions flex justify-between";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.id = "deleteBtn";
  deleteBtn.className =
    "bg-red-500 hover:bg-red-700 text-white w-fit py-2 px-5 rounded-full mt-4";
  deleteBtn.textContent = "Delete";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className =
    "bg-primary hover:bg-primary-hover text-white w-fit py-2 px-5 rounded-full mt-4";
  saveBtn.textContent = "Save Changes";

  const errorEl = document.createElement("p");
  errorEl.className = "error-message text-red-500 text-sm";

  actions.append(deleteBtn, saveBtn);

  form.append(header, fields, actions, errorEl);
  modal.appendChild(form);

  document.body.appendChild(modal);
  modal.showModal();

  // Populate existing values
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
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmModal(
      "Are you sure you want to delete this post?",
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
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
