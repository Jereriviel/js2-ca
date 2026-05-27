import { createPost } from "../../services/postsService";
import { router } from "../../app";
import type { Post } from "../../types/post";
import { showErrorModal } from "./errorModal";
import { inputModal, textArea } from "../inputs";
import { createModal } from "../../utils/createModal";
import { handleError } from "../../errors/handleError";

export function openCreatePostModal() {
  const modal = createModal("");

  const form = document.createElement("form");
  form.method = "dialog";
  form.className = "create-post-form flex flex-col gap-4 max-w-xl";

  const title = document.createElement("h2");
  title.className = "font-semibold text-xl";
  title.textContent = "Create New Post";

  const fieldsWrapper = document.createElement("div");
  fieldsWrapper.className = "flex flex-col gap-4";

  fieldsWrapper.innerHTML = `
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

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.id = "cancelBtn";
  cancelBtn.className =
    "font-medium hover:bg-gray-medium w-fit py-2 px-5 rounded-full mt-4";
  cancelBtn.textContent = "Cancel";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "bg-primary hover:bg-primary-hover text-white w-fit py-2 px-5 rounded-full mt-4";
  submitBtn.textContent = "Publish";

  actions.append(cancelBtn, submitBtn);

  const errorEl = document.createElement("p");
  errorEl.className = "error-message text-red-500 text-sm";

  form.append(title, fieldsWrapper, actions, errorEl);

  modal.appendChild(form);
  document.body.appendChild(modal);

  modal.showModal();

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
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  });

  modal.addEventListener("close", () => {
    modal.remove();
  });
}
