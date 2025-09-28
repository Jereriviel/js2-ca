import { getUser } from "../store/userStore";
import type { Comment } from "../types/post";

export function renderComment(c: Comment): string {
  const currentUser = getUser();
  const isOwnComment = currentUser?.name === c.author?.name;
  const authorName = c.author?.name ?? (c as any).owner ?? "Unknown";
  const createdDate = c.created
    ? new Date(c.created).toLocaleString()
    : new Date().toLocaleString();

  return `
    <article class="comment flex flex-col gap-2" data-comment-id="${
      c.id
    }" data-post-id="${c.postId}">
    <hr class="h-[1px] bg-gray-medium border-none">
      <p class="font-medium text-lg">${authorName}</p>
      <p>${c.body}</p>
      <div class="flex justify-between">
        <div class="text-xs text-gray-dark">${createdDate}</div>
        ${
          isOwnComment
            ? `<button class="delete-comment-btn hover:bg-red-500 hover:text-white text-sm font-medium w-fit py-3 px-4 rounded-full" data-comment-id="${c.id}" data-post-id="${c.postId}">Delete</button>`
            : ""
        }
      </div>
    </article>
  `;
}

export function renderComments(comments: Comment[]): string {
  if (!comments || comments.length === 0) {
    return `<div class="comments-container"><p>No comments yet.</p></div>`;
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return `
    <div class="comments-container flex flex-col gap-4">
      <h2 class="font-semibold text-xl">Comments</h2>
      ${sortedComments.map(renderComment).join("")}
    </div>
  `;
}
