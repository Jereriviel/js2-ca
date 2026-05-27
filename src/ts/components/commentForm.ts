import { getUser } from "../store/userStore";
import type { Profile } from "../types/profile";

export function commentForm(postId: number, userProfile: Profile): HTMLElement {
  const wrapper = document.createElement("div");

  const loggedInUser = getUser();

  if (!loggedInUser) {
    const message = document.createElement("p");
    message.className = "text-gray-dark text-sm italic";
    message.textContent = "You must be logged in to comment.";
    wrapper.appendChild(message);
    return wrapper;
  }

  const container = document.createElement("div");
  container.className = "flex items-start gap-4 py-4";
  container.dataset.postId = String(postId);

  const img = document.createElement("img");
  img.className = "rounded-full w-12 h-12 object-cover";
  img.src = userProfile?.avatar?.url || "/default-avatar.png";
  img.alt = userProfile?.avatar?.alt || "User avatar";

  const profileWrapper = document.createElement("div");
  profileWrapper.className = "profile-link";

  const figure = document.createElement("figure");
  figure.appendChild(img);
  profileWrapper.appendChild(figure);

  const form = document.createElement("form");
  form.className = "comment-form flex flex-col grow gap-4";
  form.dataset.postId = String(postId);

  const textarea = document.createElement("textarea");
  textarea.name = "comment";
  textarea.placeholder = "Write your comment here...";
  textarea.required = true;
  textarea.className = "w-full rounded-xl border border-gray-medium p-4";

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "flex justify-end";

  const button = document.createElement("button");
  button.type = "submit";
  button.className =
    "bg-primary hover:bg-primary-hover text-white text-sm w-fit py-2 px-5 rounded-full";
  button.textContent = "Post Comment";

  buttonWrapper.appendChild(button);
  form.append(textarea, buttonWrapper);

  container.append(profileWrapper, form);

  const hr = document.createElement("hr");
  hr.className = "h-px bg-gray-medium border-none my-4";

  wrapper.append(container, hr);

  return wrapper;
}
