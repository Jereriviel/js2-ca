import { getUser } from "../store/userStore";
import type { Comment } from "../types/post";
import type { Profile } from "../types/profile";
import { getCurrentUserProfile } from "../services/profileService";

export async function renderComment(comment: Comment): Promise<string> {
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
      console.warn("Failed to fetch author profile", error);
    }
  }

  return `
    <article class="comment flex flex-col gap-2" data-comment-id="${
      comment.id
    }" data-post-id="${comment.postId}">
      <div class="flex py-3">
        <div class="profile-link pr-4">
          <figure class="w-12 h-12">
            <img
              class="rounded-full w-full h-full object-cover"
              src="${authorProfile?.avatar?.url ?? "/default-avatar.png"}"
              alt="${authorProfile?.avatar?.alt ?? authorProfile?.name ?? "User avatar"}"
            />
          </figure>
        </div>
        <div class="flex flex-col grow gap-1">
          <div class="post-header flex">
            <div class="profile-link flex items-start" data-username="${authorProfile?.name ?? "Unknown"}">
              <p class="font-medium text-lg">${authorName}</p>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <p>${comment.body}</p>
            <div class="flex justify-between items-end">
              <div class="text-xs text-gray-dark">${createdDate}</div>
              ${
                isOwnComment
                  ? `<button class="delete-comment-btn hover:bg-red-500 hover:text-white text-sm font-medium w-fit py-2 px-4 rounded-full" data-comment-id="${comment.id}" data-post-id="${comment.postId}">Delete</button>`
                  : ""
              }
            </div>
          </div>
        </div>
        </div>
      </div>
      <hr class="h-[px] bg-gray-medium border-none">
    </article>
  `;
}

export async function renderComments(comments: Comment[]): Promise<string> {
  if (!comments || comments.length === 0) {
    return `<div class="comments-container"><p>No comments yet.</p></div>`;
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
  );

  const commentsHTML = await Promise.all(sortedComments.map(renderComment));

  return `
    <div class="comments-container flex flex-col gap-4">
      <h2 class="font-semibold text-xl">Comments</h2>
      ${commentsHTML.join("")}
    </div>
  `;
}
