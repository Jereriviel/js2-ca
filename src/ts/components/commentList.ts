import { getUser } from "../store/userStore";
import type { Comment } from "../types/post";
import type { Profile } from "../types/profile";
import { getCurrentUserProfile } from "../services/profileService";
import { showErrorModal } from "./modals/errorModal";
import { handleError } from "../errors/handleError";

export async function renderComment(comment: Comment): Promise<HTMLElement> {
  const currentUser = getUser();

  const isOwnComment = currentUser?.name === comment.author?.name;

  const authorName = comment.author?.name ?? comment.owner ?? "Unknown";

  const createdDate = comment.created
    ? new Date(comment.created).toLocaleString()
    : new Date().toLocaleString();

  let authorProfile: Profile | undefined = comment.author;

  if (comment.author?.name) {
    try {
      authorProfile = await getCurrentUserProfile(comment.author.name);
    } catch (error) {
      await showErrorModal(handleError(error));
    }
  }

  const article = document.createElement("article");
  article.className = "comment flex flex-col gap-2";
  article.dataset.commentId = String(comment.id);
  article.dataset.postId = String(comment.postId);

  const wrapper = document.createElement("div");
  wrapper.className = "flex py-3";

  const profileLinkWrapper = document.createElement("div");
  profileLinkWrapper.className = "profile-link pr-4";

  const figure = document.createElement("figure");
  figure.className = "w-12 h-12";

  const image = document.createElement("img");
  image.className = "rounded-full w-full h-full object-cover";

  image.src = authorProfile?.avatar?.url ?? "/default-avatar.png";

  image.alt =
    authorProfile?.avatar?.alt ?? authorProfile?.name ?? "User avatar";

  figure.appendChild(image);
  profileLinkWrapper.appendChild(figure);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "flex flex-col grow gap-1";

  const postHeader = document.createElement("div");
  postHeader.className = "post-header flex";

  const profileLink = document.createElement("div");
  profileLink.className = "profile-link flex items-start";

  profileLink.dataset.username = authorProfile?.name ?? "Unknown";

  const authorParagraph = document.createElement("p");
  authorParagraph.className = "font-medium text-lg";
  authorParagraph.textContent = authorName;

  profileLink.appendChild(authorParagraph);
  postHeader.appendChild(profileLink);

  const commentContent = document.createElement("div");
  commentContent.className = "flex flex-col gap-3";

  const bodyParagraph = document.createElement("p");
  bodyParagraph.textContent = comment.body;

  const footer = document.createElement("div");
  footer.className = "flex justify-between items-end";

  const dateElement = document.createElement("div");
  dateElement.className = "text-xs text-gray-dark";
  dateElement.textContent = createdDate;

  footer.appendChild(dateElement);

  if (isOwnComment) {
    const deleteButton = document.createElement("button");

    deleteButton.className =
      "delete-comment-btn hover:bg-red-500 hover:text-white text-sm font-medium w-fit py-2 px-4 rounded-full";

    deleteButton.dataset.commentId = String(comment.id);
    deleteButton.dataset.postId = String(comment.postId);

    deleteButton.textContent = "Delete";

    footer.appendChild(deleteButton);
  }

  commentContent.append(bodyParagraph, footer);

  contentWrapper.append(postHeader, commentContent);

  wrapper.append(profileLinkWrapper, contentWrapper);

  const hr = document.createElement("hr");
  hr.className = "h-[1px] bg-gray-medium border-none";

  article.append(wrapper, hr);

  return article;
}

export async function renderComments(
  comments: Comment[],
): Promise<HTMLElement> {
  const container = document.createElement("div");

  container.className = "comments-container flex flex-col gap-4";

  if (!comments || comments.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No comments yet.";

    container.appendChild(emptyMessage);

    return container;
  }

  const heading = document.createElement("h2");

  heading.className = "font-semibold text-xl";
  heading.textContent = "Comments";

  container.appendChild(heading);

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  const renderedComments = await Promise.all(sortedComments.map(renderComment));

  renderedComments.forEach((commentElement) => {
    container.appendChild(commentElement);
  });

  return container;
}
